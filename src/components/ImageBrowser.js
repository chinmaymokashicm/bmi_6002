import Image from "./Image";

const ImageBrowser = ({ onImageChange, imageBrowserRef}) => {
  return (
    <div className="component-image-browser">
      <h2 style={{ textAlign: "center" }}> Select upto 4 images </h2>
      <label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onImageChange}
          ref={imageBrowserRef}
        />
      </label>
    </div>
  );
};

export default ImageBrowser;
