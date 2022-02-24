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

import GetPixels from "./functions/GetPixels";
import clone from "just-clone";

function App() {
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
  const [stackData, setStackData] = useState({ 0: [] });
  const [stackCounter, setStackCounter] = useState(0);

  useEffect(() => {
    if (images.length < 1 || images.length > 4) {
      return;
    }
    const newImageURLs = [];
    for (var i = 0; i < images.length; i++) {
      newImageURLs.push({
        objectURL: URL.createObjectURL(images[i]),
        imageName: imageNames[i],
        id: i,
        image: images[i],
      });
      // console.log(images[i])
    }
    setImageURLs(newImageURLs);
    setStackImageURLs({
      [stackCounter]: newImageURLs,
      [stackCounter + 1]: newImageURLs,
    }); //Initialize stack
  }, [images]);

  function onImageChange(e) {
    setImages(e.target.files);
    const newImageNames = [];
    for (var i = 0; i < e.target.files.length; i++) {
      newImageNames.push(e.target.files[i].name);
    }
    setImageNames(newImageNames);
  }

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
      var imageURLsObj = stackImageURLs;
      imageURLsObj[stackCounter] =
        imageURLsObj[Object.keys(stackImageURLs).length - 1];
      setStackImageURLs(imageURLsObj);
      setIsCounterChangeOnButton(false);
    }
    setImageURLs(stackImageURLs[stackCounter]);

    if (stackData[stackCounter] === undefined && !isCounterChangeOnButton) {
      // If there is no new data is generated in this counter, just copy the previous one
      var dataObj = stackData;
      console.log("stackCounter inside stackData undefined!", stackCounter);
      dataObj[stackCounter] = dataObj[Object.keys(stackData).length - 1];
      setStackData(dataObj);
      setIsCounterChangeOnButton(false);
    }
    // console.log("stackData", stackData);
  }, [stackCounter]);

  // Image Processing
  const [imgDataArray, setImgDataArray] = useState([]);
  const imageRef = useRef()

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
  }
  const componentFooterSelect = (
    <Footer continueOnClick={continueButtonSelect} />
  );

  function continueButtonPreview(e) {
    setExpandedProcessing(true);
    // setExpandedPreview(false);
    GetPixels(stackImageURLs, stackCounter, setImgDataArray);

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
  const componentUndoRedo = (
    <div className="UndoRedo">
      <Button
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
      />
      {`${stackCounter}/${Object.keys(stackImageURLs).length - 1}`}
    </div>
  );
  const componentSelect = <ImageBrowser onImageChange={onImageChange} />;
  const componentImagePreview = (
    <Carousel
      setImgDataArray={setImgDataArray}
      imageRef={imageRef}
      stackImageURLs={stackImageURLs}
      setStackImageURLs={setStackImageURLs}
      stackCounter={stackCounter}
      setStackCounter={setStackCounter}
    />
  );
  const componentProcessing = (
    <Processing
      imageURLs={imageURLs}
      setImageURLs={setImageURLs}
      imgDataArray={imgDataArray}
      setImgDataArray={setImgDataArray}
      stackImageURLs={stackImageURLs}
      setStackImageURLs={setStackImageURLs}
      stackCounter={stackCounter}
      setStackCounter={setStackCounter}
      stackData={stackData}
      setStackData={setStackData}
    />
  );
  const componentML = <div>Machine Learning</div>;
  const componentResults = <div>Results</div>;

  return (
    <div className="App">
      <div className="component-temp">
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
      </div>
      <div className="component-select">
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
