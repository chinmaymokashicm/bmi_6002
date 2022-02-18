import "./App.css";
import { useEffect, useRef, useState } from "react";
import useCollapse from "react-collapsed";

import ImageBrowser from "./components/ImageBrowser";
import Section from "./components/Section";
import Footer from "./components/Footer";
import Carousel from "./components/Carousel";
import Processing from "./components/Processing";


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
  }, [images]);


  function onImageChange(e) {
    setImages(e.target.files);
    const newImageNames = [];
    for (var i = 0; i < e.target.files.length; i++) {
      newImageNames.push(e.target.files[i].name);
    }
    setImageNames(newImageNames);
  }

  // Image Processing
  const [imgDataArray, setImgDataArray] = useState([])
  const [imgRGBArray, setImgRGBArray] = useState([])
  // When the value of this state is set to true, image pixel data are generated
  const [getImgData, setGetImgData] = useState(false)

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

  const componentFooterStandard = <Footer />;
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
    setGetImgData(true) //Generates image pixel data
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

  const componentSelect = <ImageBrowser onImageChange={onImageChange} />;
  const divRef = useRef(); //Ref for image div
  const componentImagePreview = (
    <Carousel
      imageURLs={imageURLs}
      setImageURLs={setImageURLs}
      divRef={divRef}
      setImgDataArray={setImgDataArray}
      setImgRGBArray={setImgRGBArray}
      getImgData={getImgData}
    />
  );
  const componentProcessing = (
    <Processing imageURLs={imageURLs} imgDataArray={imgDataArray} setImgDataArray={setImgDataArray} />
  );
  const componentML = <div>Machine Learning</div>;
  const componentResults = <div>Results</div>;

  return (
    <div className="App">
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
