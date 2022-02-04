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
        id: i
      })
    }
    setImageURLs(newImageURLs);
  }, [images]);

  function onImageChange(e) {
    setImages(e.target.files);
    const newImageNames = []
    for (var i=0; i<e.target.files.length; i++){
      newImageNames.push(e.target.files[i].name)
    }
    setImageNames(newImageNames)
  }

  // Components
  const footerStandardComponent = <Footer />;
  const imageBrowserComponent = <ImageBrowser onImageChange={onImageChange}/>;
  const ImagePreviewComponent = <Carousel imageURLs={imageURLs} />;

  // // Hooks for collapsible components
  const [isExpandedSelect, setExpandedSelect] = useState(false);
  const {
    getCollapseProps: getCollapsePropsSelect,
    getToggleProps: getTogglePropsSelect,
  } = useCollapse({ isExpanded: isExpandedSelect });

  const [isExpandedPreview, setExpandedPreview] = useState(false);
  const {
    getCollapseProps: getCollapsePropsPreview,
    getToggleProps: getTogglePropsPreview,
  } = useCollapse({ isExpanded: isExpandedPreview });

  return (
    <div className="App">
      {/* {imageBrowserComponent} */}
      <div className="Select">
        <Section 
        header="Select image(s"
        component={imageBrowserComponent}
        footer={footerStandardComponent}
        isExpanded={isExpandedSelect}
        setExpanded={setExpandedSelect}
        getCollapseProps={getCollapsePropsSelect}
        getToggleProps={getTogglePropsSelect}
        />
      </div>
        {/* {ImagePreviewComponent}
         */}
      <div className="Preview">
      <Section 
        header="Select image(s"
        component={ImagePreviewComponent}
        footer={footerStandardComponent}
        isExpanded={isExpandedPreview}
        setExpanded={setExpandedPreview}
        getCollapseProps={getCollapsePropsPreview}
        getToggleProps={getTogglePropsPreview}
        />
      </div>
    </div>
  );
}

export default App;
