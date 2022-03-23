import "./App.css";
import { useEffect, useRef, useState } from "react";
import useCollapse from "react-collapsed";

import ImageBrowser from "./components/ImageBrowser";
import Section from "./components/Section";
import Footer from "./components/Footer";
import Carousel from "./components/Carousel";
import Processing from "./components/Processing";
import Float from "./components/Float";
import Button from "./components/Button";

import { MdHelpCenter } from "react-icons/md";

import clone from "just-clone";
import GetImageDimensions from "./functions/GetImageDimensions";
import UpdateImageDimensions from "./functions/UpdateImageDimensions";
import CreateLabeledVesselDensityObj from "./functions/CreateLabeledVesselDensityObj";

function App() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [imageDimensions, setImageDimensions] = useState([]);

  /* File browsing */
  const [images, setImages] = useState([]);
  const defaultImageURLarray = [
    {
      objectURL: undefined,
      imageName: undefined,
      id: undefined,
      image: undefined,
    },
  ];
  const [imageNames, setImageNames] = useState();
  const [imageURLs, setImageURLs] = useState(defaultImageURLarray);

  // Stack for undo-redo functionality
  const [stackImageURLs, setStackImageURLs] = useState({
    0: defaultImageURLarray,
  });

  const defaultOverlayURLarray = new Array(4).fill({
    innerCircle: defaultImageURLarray.objectURL,
    IN: defaultImageURLarray.objectURL,
    II: defaultImageURLarray.objectURL,
    IT: defaultImageURLarray.objectURL,
    IS: defaultImageURLarray.objectURL,
  });
  const [stackOverlayURLs, setStackOverlayURLs] = useState({
    0: defaultOverlayURLarray,
  });

  const [stackData, setStackData] = useState({
    0: {
      function: [],
      overlay: {},
    },
  });
  const [stackCounter, setStackCounter] = useState(0);
  const [overlayURLs, setOverlayURLs] = useState(
    stackOverlayURLs[stackCounter]
  );

  useEffect(() => {
    if (images.length < 1 || images.length > 4) {
      return;
    }
    const newImageURLs = [];
    const newOverlayURLs = [];
    for (var i = 0; i < images.length; i++) {
      var newObjectURL = URL.createObjectURL(images[i]);
      newImageURLs.push({
        objectURL: newObjectURL,
        imageName: imageNames[i],
        id: i,
        image: images[i],
      });
      newOverlayURLs.push({
        innerCircle: undefined,
        IN: undefined,
        II: undefined,
        IT: undefined,
        IS: undefined,
      });
    }
    setImageURLs(newImageURLs);
    setStackImageURLs({
      [stackCounter]: newImageURLs,
      [stackCounter + 1]: newImageURLs,
    }); //Initialize stack
    // Initialize overlay URLs
    setStackOverlayURLs({
      [stackCounter]: newOverlayURLs,
      // [stackCounter + 1]: newOverlayURLs
    });
    // Initialize overlay data
    setOverlayData(
      new Array(images.length).fill({
        x: 50,
        y: 50,
        radius: 40,
      })
    );
    console.log("Setting image dimensions");
    UpdateImageDimensions(newImageURLs, setImageDimensions);

    // Set imageLabels
    setImageLabelArray(new Array(images.length).fill(undefined));
  }, [images]);

  const [imageLabelArray, setImageLabelArray] = useState([]);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  function onImageChange(e) {
    setImages(e.target.files);
    const newImageNames = [];
    for (var i = 0; i < e.target.files.length; i++) {
      newImageNames.push(e.target.files[i].name);
    }
    setImageNames(newImageNames);
    setExpandedPreview(true);
    setExpandedSelect(false);
    // previewSectionRef.focus();
  }

  // Keyboard functionality
  const imageBrowserRef = useRef();
  const previewSectionRef = useRef();

  useEffect(() => {
    imageBrowserRef.current.focus();
  }, []);

  // Undo-redo
  useEffect(() => {
    setUndoVisibility();
    setRedoVisibility();
    if (
      stackImageURLs[stackCounter] === undefined &&
      !isCounterChangeOnButton
    ) {
      // Only if not on button change
      // If no new imageURLs are generated in this counter, just copy the previous one
      console.log(
        "stackCounter inside stackImageURLs undefined!",
        stackCounter
      );
      var imageURLsObj = clone(stackImageURLs);
      imageURLsObj[stackCounter] =
        imageURLsObj[Object.keys(stackImageURLs).length - 1];
      setStackImageURLs(imageURLsObj);
      // setIsCounterChangeOnButton(false);
    }
    setImageURLs(stackImageURLs[stackCounter]);

    if (stackData[stackCounter] === undefined && !isCounterChangeOnButton) {
      // If there is no new data is generated in this counter, just copy the previous one
      var dataObj = stackData;
      console.log("stackCounter inside stackData undefined!", stackCounter);
      dataObj[stackCounter] = dataObj[Object.keys(stackData).length - 1];
      setStackData(dataObj);
      // setIsCounterChangeOnButton(false);
    }

    if (
      stackOverlayURLs[stackCounter] === undefined &&
      !isCounterChangeOnButton
    ) {
      //If there are no new overlays in this counter, just copy the previous one
      var tempOverlayURLs = stackOverlayURLs;
      tempOverlayURLs[stackCounter] =
        tempOverlayURLs[Object.keys(stackOverlayURLs).length - 1];
      setStackOverlayURLs(tempOverlayURLs);
    }
    setOverlayURLs(stackOverlayURLs[stackCounter]);

    // console.log("stackCounter updated to ", stackCounter)
    setIsCounterChangeOnButton(false);
  }, [stackCounter]);

  // Image Processing
  const [overlayPixelsArray, setOverlayPixelsArray] = useState([]);
  const [imagePixelsArray, setImagePixelsArray] = useState([]);
  const [vesselDensityArray, setVesselDensityArray] = useState([]);
  const imageRef = useRef();
  const [overlayWidth, setOverlayWidth] = useState(100);
  const [overlayHeight, setOverlayHeight] = useState(100);

  const [overlayData, setOverlayData] = useState([]);

  const [currentTabValue, setCurrentTabValue] = useState(0);

  const [labeledVesselDensityObj, setLabeledVesselDensityObj] = useState({});

  useEffect(() => {
    console.log("Change in vesselDensityArray or imageLabelArray!");
    if (imageLabelArray.every((imageLabel) => imageLabel !== undefined)) {
      var imageLabels = [];
      for (let i = 0; i < imageLabelArray.length; i++) {
        imageLabels.push(imageLabelArray[i]);
      }
      var imageLabelSet = new Set(imageLabels);
      if (imageLabels.length !== imageLabelSet.size) {
        alert("Cannot assign one label to multiple images!");
        setLabeledVesselDensityObj({});
      }
      if (
        imageLabels.length === imageLabelSet.size &&
        vesselDensityArray.length > 0
      ) {
        console.log("Ready to generate vesseldensity object!")
        setIsSubmitButtonDisabled(false);
        continueButtonPreview();
        continueButtonProcessing();
        console.log(imageLabelArray, vesselDensityArray);
        CreateLabeledVesselDensityObj(
          imageLabelArray,
          vesselDensityArray,
          setLabeledVesselDensityObj
        );
      }
    }
  }, [vesselDensityArray, imageLabelArray]);

  function updateOverlayDimensions() {
    var currentDimensions = imageDimensions;
    setOverlayWidth(currentDimensions.width);
    setOverlayHeight(currentDimensions.height);
  }

  useEffect(() => {
    // Setting overlay data
    var tempOverlayData = [];
    for (let i = 0; i < imageDimensions.length; i++) {
      console.log("Updating overlay data");
      tempOverlayData.push({
        x: Math.round(imageDimensions[i].width / 2),
        y: Math.round(imageDimensions[i].height / 2),
        radius: Math.round(
          Math.min(imageDimensions[i].width / 4, imageDimensions[i].height / 4)
        ),
      });
      setOverlayData(tempOverlayData);
    }
  }, [imageDimensions]);

  // useEffect(() => {
  //   if (!isFirstLoad) {
  //     console.log("Change in overlayPixelsArray");
  //   }
  //   setIsFirstLoad(false);
  // }, [overlayPixelsArray]);

  // Hooks for collapsible components
  const [isExpandedSelect, setExpandedSelect] = useState(true);
  const {
    getCollapseProps: getCollapsePropsSelect,
    getToggleProps: getTogglePropsSelect,
  } = useCollapse({ isExpanded: isExpandedSelect });

  const [isExpandedPreview, setExpandedPreview] = useState(false);
  const {
    getCollapseProps: getCollapsePropsPreview,
    getToggleProps: getTogglePropsPreview,
  } = useCollapse({ isExpanded: isExpandedPreview });

  const [isExpandedProcessing, setExpandedProcessing] = useState(false);
  const {
    getCollapseProps: getCollapsePropsProcessing,
    getToggleProps: getTogglePropsProcessing,
  } = useCollapse({ isExpanded: isExpandedProcessing });

  const [isExpandedML, setExpandedML] = useState(false);
  const {
    getCollapseProps: getCollapsePropsML,
    getToggleProps: getTogglePropsML,
  } = useCollapse({ isExpanded: isExpandedML });

  const [isExpandedResults, setExpandedResults] = useState(false);
  const {
    getCollapseProps: getCollapsePropsResults,
    getToggleProps: getTogglePropsResults,
  } = useCollapse({ isExpanded: isExpandedResults });

  // Components
  function continueButtonSelect(e) {
    setExpandedPreview(true);
    setExpandedSelect(false);
    previewSectionRef.current.focus();
  }
  const componentFooterSelect = (
    <Footer continueOnClick={continueButtonSelect} />
  );

  function continueButtonPreview(e) {
    setExpandedProcessing(true);
    // setExpandedPreview(false);
  }
  const componentFooterPreview = (
    <Footer continueOnClick={continueButtonPreview} />
  );

  function continueButtonProcessing(e) {
    setExpandedML(true);
  }
  const componentFooterProcessing = (
    <Footer continueOnClick={continueButtonProcessing} />
  );

  function continueButtonML(e) {
    setExpandedResults(true);
  }
  const componentFooterML = <Footer continueOnClick={continueButtonML} />;

  function continueButtonResults(e) {
    setExpandedResults(true);
    console.log("Reached the end of the application!");
  }
  const componentFooterResults = (
    <Footer continueText="Finish" continueOnClick={continueButtonResults} />
  );

  function setUndoVisibility() {
    if (stackCounter <= 0) {
      setIsUndoVisible(false);
    } else {
      setIsUndoVisible(true);
    }
  }
  function setRedoVisibility() {
    if (stackCounter >= Object.keys(stackImageURLs).length - 1) {
      setIsRedoVisible(false);
    } else {
      setIsRedoVisible(true);
    }
  }

  const [isUndoVisible, setIsUndoVisible] = useState(false);
  const [isRedoVisible, setIsRedoVisible] = useState(false);

  const [isCounterChangeOnButton, setIsCounterChangeOnButton] = useState(false);

  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const componentHelp = (
    <div
      style={{
        position: "fixed",
        display: isHelpVisible ? "inline-block" : "none",
        top: "20%",
        right: "30%",
        height: "40%",
        width: "40%",
        borderColor: "red",
        borderStyle: "solid",
        backgroundColor: "#f0d4ad",
        overflowY: "scroll",
        opacity: "0.8",
        zIndex: "10",
      }}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
      <Button
        text="Close"
        onClick={() => {
          setIsHelpVisible(false);
        }}
        style={{
          bottom: 0,
          right: 0,
        }}
      />
    </div>
  );
  const componentUndoRedo = (
    <div className="UndoRedo">
      {/* <Button
        text="Undo"
        onClick={() => {
          if (stackCounter > 0) {
            setStackCounter(stackCounter - 1);
            setIsCounterChangeOnButton(true);
          } else {
            alert("At the beginning of stack! No more undo");
          }
        }}
        disabled={!isUndoVisible}
      />
      <Button
        text="Redo"
        onClick={() => {
          if (stackCounter < Object.keys(stackImageURLs).length - 1) {
            setStackCounter(stackCounter + 1);
            setIsCounterChangeOnButton(true);
          } else {
            alert("At the end of stack! No more redo");
          }
        }}
        disabled={!isRedoVisible}
      /> */}
      <Button
        text={<MdHelpCenter />}
        onClick={() => {
          console.log("Help");
          setIsHelpVisible(!isHelpVisible);
          console.log(isHelpVisible);
        }}
      />
      {/* {`${stackCounter}/${Object.keys(stackImageURLs).length - 1}`} */}
    </div>
  );
  const componentSelect = (
    <ImageBrowser
      onImageChange={onImageChange}
      imageBrowserRef={imageBrowserRef}
    />
  );
  const componentImagePreview = (
    <div
      style={{
        overflow: "scroll",
      }}
    >
      <Carousel
        imageRef={imageRef}
        imageLabelArray={imageLabelArray}
        setImageLabelArray={setImageLabelArray}
        previewSectionRef={previewSectionRef}
        stackImageURLs={stackImageURLs}
        setStackImageURLs={setStackImageURLs}
        stackCounter={stackCounter}
        setStackCounter={setStackCounter}
        overlayWidth={overlayWidth}
        setOverlayWidth={setOverlayWidth}
        overlayHeight={overlayHeight}
        setOverlayHeight={setOverlayHeight}
        imageDimensions={imageDimensions}
        updateOverlayDimensions={updateOverlayDimensions}
        overlayData={overlayData}
        setOverlayData={setOverlayData}
        overlayPixelsArray={overlayPixelsArray}
        setOverlayPixelsArray={setOverlayPixelsArray}
        vesselDensityArray={vesselDensityArray}
        setVesselDensityArray={setVesselDensityArray}
        overlayURLs={overlayURLs}
        setOverlayURLs={setOverlayURLs}
        stackOverlayURLs={stackOverlayURLs}
        setStackOverlayURLs={setStackOverlayURLs}
        currentTabValue={currentTabValue}
        setCurrentTabValue={setCurrentTabValue}
        stackData={stackData}
        setStackData={setStackData}
        isSubmitButtonDisabled={isSubmitButtonDisabled}
        setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
        labeledVesselDensityObj={labeledVesselDensityObj}
        imagePixelsArray={imagePixelsArray}
        setImagePixelsArray={setImagePixelsArray}
      />
    </div>
  );
  const componentProcessing = (
    <div
      style={{
        height: "auto",
        overflow: "hidden",
        padding: "10px",
        // marginTop: "10px"
      }}
    >
      <Processing
        overlayPixelsArray={overlayPixelsArray}
        setOverlayPixelsArray={setOverlayPixelsArray}
        stackImageURLs={stackImageURLs}
        setStackImageURLs={setStackImageURLs}
        stackCounter={stackCounter}
        setStackCounter={setStackCounter}
        stackData={stackData}
        setStackData={setStackData}
        overlayData={overlayData}
        setOverlayData={setOverlayData}
        setOverlayURLs={setOverlayURLs}
        stackOverlayURLs={stackOverlayURLs}
        setStackOverlayURLs={setStackOverlayURLs}
        setCurrentTabValue={setCurrentTabValue}
        vesselDensityArray={vesselDensityArray}
        setVesselDensityArray={setVesselDensityArray}
        isSubmitButtonDisabled={isSubmitButtonDisabled}
        setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
        labeledVesselDensityObj={labeledVesselDensityObj}
        imagePixelsArray={imagePixelsArray}
        setImagePixelsArray={setImagePixelsArray}
      />
    </div>
  );
  const componentML = <div>Machine Learning</div>;
  const componentResults = <div>Results</div>;

  useEffect(() => {
    if (previewSectionRef.current) {
      previewSectionRef.current.focus();
    }
  }, [previewSectionRef]);

  return (
    <div
      className="App"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "i") {
          setIsHelpVisible(!isHelpVisible);
        }
        if (e.key === "o") {
          imageBrowserRef.current.click();
          // previewSectionRef.current.focus()
        }
      }}
    >
      {componentHelp}
      <div
        className="undo-redo"
        style={{
          position: "fixed",
          top: "50px",
          right: "50px",
        }}
      >
        {componentUndoRedo}
      </div>
      {/* <div className="component-temp">
        {componentUndoRedo}
        <Button
          text="stackData"
          onClick={() => {
            console.log("stackData", stackData);
          }}
        />
        <Button
          text="stackImageURLs"
          onClick={() => {
            console.log("stackImageURLs", stackImageURLs);
          }}
        />
        <Button
          text="data"
          onClick={() => {
            console.log("data", stackData[stackCounter]);
          }}
        />
        <Button
          text="imageURLs"
          onClick={() => {
            console.log("imageURLs", imageURLs);
          }}
        />
        <Button
          text="overlay data"
          onClick={() => {
            console.log(overlayData);
          }}
        />
        <Button text="overlayPixelsArray" onClick={() => console.log(overlayPixelsArray)} />
        <Button
          text="Image dimensions"
          onClick={() => {
            console.log(imageDimensions);
          }}
        />
        <Button
          text="imageRef.current"
          onClick={() => {
            console.log(imageRef.current);
          }}
        />
        <Button
          text="stackOverlayURLs"
          onClick={() => {
            console.log(stackOverlayURLs);
          }}
        />
        <Button text="overlayURLs" onClick={() => {
          console.log(overlayURLs)
        }} />
      </div> */}
      <div
        className="component-select"
        tabIndex="1"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setExpandedPreview(true);
            setExpandedSelect(false);
            previewSectionRef.current.focus();
          }
        }}
      >
        <Section
          header="Select image(s)"
          component={componentSelect}
          footer={componentFooterSelect}
          isExpanded={isExpandedSelect}
          setExpanded={setExpandedSelect}
          getCollapseProps={getCollapsePropsSelect}
          getToggleProps={getTogglePropsSelect}
        />
      </div>
      <div className="component-preview">
        <Section
          header="Preview"
          component={componentImagePreview}
          footer={componentFooterPreview}
          isExpanded={isExpandedPreview}
          setExpanded={setExpandedPreview}
          getCollapseProps={getCollapsePropsPreview}
          getToggleProps={getTogglePropsPreview}
        />
      </div>
      <div className="component-processing">
        <Section
          header="Processing"
          component={componentProcessing}
          footer={componentFooterProcessing}
          isExpanded={isExpandedProcessing}
          setExpanded={setExpandedProcessing}
          getCollapseProps={getCollapsePropsProcessing}
          getToggleProps={getTogglePropsProcessing}
        />
      </div>
      <div className="component-ml">
        <Section
          header="Machine Learning"
          component={componentML}
          footer={componentFooterML}
          isExpanded={isExpandedML}
          setExpanded={setExpandedML}
          getCollapseProps={getCollapsePropsML}
          getToggleProps={getTogglePropsML}
        />
      </div>
      <div className="component-results">
        <Section
          header="Results"
          component={componentResults}
          footer={componentFooterResults}
          isExpanded={isExpandedResults}
          setExpanded={setExpandedResults}
          getCollapseProps={getCollapsePropsResults}
          getToggleProps={getTogglePropsResults}
        />
      </div>
    </div>
  );
}

export default App;
