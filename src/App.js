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
  const [imageURLs, setImageURLs] = useState(defaultImageURLarray);
  const [imageNames, setImageNames] = useState();

  // Stack for undo-redo functionality
  const [stackImageURLs, setStackImageURLs] = useState([defaultImageURLarray]);
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
    }
    setImageURLs(newImageURLs);
    setStackImageURLs([newImageURLs]) //Initialized stack
  }, [images]);

  function onImageChange(e) {
    setImages(e.target.files);
    const newImageNames = [];
    for (var i = 0; i < e.target.files.length; i++) {
      newImageNames.push(e.target.files[i].name);
    }
    setImageNames(newImageNames);
    console.log("Current divRef: ", divRef.current)
  }
  
  // Undo-redo
  useEffect(() => {
    console.log("Stack counter update", stackCounter);
    setUndoVisibility()
    setRedoVisibility()
    setImageURLs(stackImageURLs[stackCounter])
  }, [stackCounter]);

  // Image Processing
  const [imgDataArray, setImgDataArray] = useState([]);

  const divRef = useRef(); //Ref for image div
  useEffect(() => {
    GetPixels(divRef, setImgDataArray);
    console.log("Getting pixel values!")
  }, [divRef])

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
    setExpandedPreview(false);
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
    console.log("Here");
  }
  const componentFooterResults = (
    <Footer continueText="Finish" continueOnClick={continueButtonResults} />
  );

  function setUndoVisibility(){
    if(stackCounter <= 0) {
      setIsUndoVisible(false)
    }
    else{
      setIsUndoVisible(true)
    }
  }
  function setRedoVisibility(){
    if(stackCounter >= stackImageURLs.length - 1) {
      setIsRedoVisible(false)
    }
    else{
      setIsRedoVisible(true)
    }
  }

  const [isUndoVisible, setIsUndoVisible] = useState(false);
  const [isRedoVisible, setIsRedoVisible] = useState(false);
  const componentUndoRedo = (
    <div className="UndoRedo">
      <Button
        text="Undo"
        onClick={() => {
          if(stackCounter > 0){
            setStackCounter(stackCounter - 1);
          }
          else {
            alert("At the beginning of stack! No more undo")
          }
        }}
        disabled={!isUndoVisible}
      />
      <Button
        text="Redo"
        onClick={() => {
          if(stackCounter < stackImageURLs.length - 1){
            setStackCounter(stackCounter + 1);
          }
          else {
            alert("At the end of stack! No more redo")
          }
        }}
        disabled={!isRedoVisible}
      />
      {stackCounter}
    </div>
  );
  const componentSelect = <ImageBrowser onImageChange={onImageChange} />;
  const componentImagePreview = (
    <Carousel
      imageURLs={imageURLs}
      setImageURLs={setImageURLs}
      divRef={divRef}
      setImgDataArray={setImgDataArray}
      // Update stack
      stackImageURLs={stackImageURLs}
      setStackImageURLs={setStackImageURLs}
      stackCounter={stackCounter}
      setStackCounter={setStackCounter}
    />
  );
  const componentProcessing = (
    <Processing
      imageURLs={imageURLs}
      imgDataArray={imgDataArray}
      setImgDataArray={setImgDataArray}
      stackCounter={stackCounter}
      setStackCounter={setStackCounter}
    />
  );
  const componentML = <div>Machine Learning</div>;
  const componentResults = <div>Results</div>;

  return (
    <div className="App">
      <div className="Float">{componentUndoRedo}</div>
      <div className="Select">
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
      <div className="Preview" style={{ borderStyle: "dotted" }}>
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
      <div className="Processing">
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
      <div className="ML">
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
      <div className="Results">
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
