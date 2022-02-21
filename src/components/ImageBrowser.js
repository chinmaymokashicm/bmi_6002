import Image from "./Image";

const ImageBrowser = ({ onImageChange }) => {
  return (
    <div className="component-image-browser">
      <input type="file" multiple accept="image/*" onChange={onImageChange}/>
    </div>
  );
};

export default ImageBrowser;
