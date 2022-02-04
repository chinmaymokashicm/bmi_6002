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

  useEffect(() => {
    if (images.length < 1 || images.length > 4) {
      return;
    }
    const newImageURLs = [];
    for (var i = 0; i < images.length; i++) {
      newImageURLs.push(URL.createObjectURL(images[i]));
    }
    setImageURLs(newImageURLs);
  }, [images]);

  function onImageChange(e) {
    setImages(e.target.files);
  }

  // Components
  // const footerStandardComponent = <Footer />;
  // const imageBrowserComponent = <ImageBrowser onImageChange={onImageChange} imageURLs={imageURLs}/>;
  // const ImagePreviewComponent = <Carousel imageURLs={imageURLs} />;

  // // Hooks for collapsible components
  // const [isExpandedSelect, setExpandedSelect] = useState(false);
  // const {
  //   getCollapseProps: getCollapsePropsSelect,
  //   getToggleProps: getTogglePropsSelect,
  // } = useCollapse({ isExpanded: isExpandedSelect });

  return (
    <div className="App">
      <input type="file" multiple accept="image/*" onChange={onImageChange} />
      {imageURLs.map((imageSrc) => (
        <img src={imageSrc} />
      ))}
    </div>
  );
}

export default App;
