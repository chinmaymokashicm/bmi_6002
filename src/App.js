import "./App.css";
import { useEffect, useState } from "react";
import useCollapse from "react-collapsed";

import ImageBrowser from "./components/ImageBrowser";
import Section from "./components/Section";
import Footer from "./components/Footer";
import Carousel from "./components/Carousel";
import Image from "./components/Image";

function App() {
  /* File browsing */
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [imageName, setImageNames] = useState();

  useEffect(() => {
    if (images.length < 1 || images.length > 4) {
      return;
    }
    const newImageURLs = [];
    for (var i = 0; i < images.length; i++) {
      // newImageURLs.push(URL.createObjectURL(images[i]));
      newImageURLs.push({
        objectURL: URL.createObjectURL(images[i]),
        imageName: imageName[i],
        id: i,
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

  // // Hooks for collapsible components
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
  const componentFooterStandard = <Footer />;

  function continueButtonSelect(e) {
    setExpandedPreview(true);
  }
  const componentFooterSelect = (
    <Footer continueOnClick={continueButtonSelect} />
  );

  function continueButtonPreview(e) {
    setExpandedProcessing(true);
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
  const componentFooterML = (
    <Footer continueOnClick={continueButtonML} />
  );

  function continueButtonResults(e) {
    setExpandedResults(true);
    console.log("Here");
  }
  const componentFooterResults = (
    <Footer continueText="Finish" continueOnClick={continueButtonResults} />
  );

  const componentSelect = <ImageBrowser onImageChange={onImageChange} />;
  const componentImagePreview = <Carousel imageURLs={imageURLs} />;
  const componentProcessing = <div>Processing</div>
  const componentML = <div>Machine Learning</div>
  const componentResults = <div>Results</div>

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
      <div className="Preview">
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
