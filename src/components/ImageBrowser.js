import Image from "./Image";

const ImageBrowser = ({ onImageChange }) => {
  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={onImageChange} />
    </div>
  );
};

export default ImageBrowser;
