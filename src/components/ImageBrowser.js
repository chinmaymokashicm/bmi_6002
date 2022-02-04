import Image from "./Image";

const ImageBrowser = ({ onImageChange, imageURLs }) => {
  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={onImageChange} />
      {imageURLs.map((imageURL) => (
        <Image id={imageURL.id} src={imageURL.url} alt={imageURL.name}/>
      ))}
    </div>
  );
};

export default ImageBrowser;
