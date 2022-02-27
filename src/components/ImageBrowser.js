import Image from "./Image";

const ImageBrowser = ({ onImageChange }) => {
  return (
    <div className="component-image-browser">
      <h2 style={{textAlign: "center"}}> Select upto 4 images </h2>
      <input type="file" multiple accept="image/*" onChange={onImageChange}/>
    </div>
  );
};

export default ImageBrowser;
