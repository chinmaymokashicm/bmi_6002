import { useState, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import Image from "./Image";
import Button from "./Button";

import GetPixels from "../functions/GetPixels";

const Carousel = ({
  imageURLs,
  setImageURLs,
  divRef,
  setImgDataArray,
  getImgData,
  stackImageURLs,
  setStackImageURLs,
  stackCounter,
  setStackCounter,
}) => {
  const [isCarouselVisible, setIsCarouselVisible] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crop, setCrop] = useState();
  // { aspect: 16 / 9 }
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCroppedSectionVisible, setIsCroppedSectionVisible] = useState(false);

  let CarouselStyle = {};
  if (!isCarouselVisible) {
    CarouselStyle.display = "none";
  }
  if (isCarouselVisible) {
    CarouselStyle.display = "inline";
  }

  function getCroppedImage() {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    // New lines to be added
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, setCroppedImage, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Image = canvas.toDataURL("image/jpeg");
    setCroppedImage(base64Image);
  }

  let CroppedSectionStyle = {};
  if (!isCroppedSectionVisible) {
    CroppedSectionStyle.display = "none";
    // "inline"
  }
  if (isCroppedSectionVisible) {
    CroppedSectionStyle.display = "inline";
  }

  return (
    <div className="image-preview">
      {imageURLs[0].objectURL !== undefined && (
        <div className="image-carousel" style={CarouselStyle}>
          <div className="carousel-test">
            {imageURLs[currentImageIndex].id + 1} |{" "}
            {imageURLs[currentImageIndex].imageName}
            <div className="image-view" id="1" ref={divRef}>
              {imageURLs.map((imageSrc) => (
                <Image
                  alt={imageSrc.imageName}
                  id={imageSrc.id}
                  src={imageSrc.objectURL}
                  isVisible={
                    imageSrc.id === currentImageIndex ? "inline" : "none"
                  }
                />
              ))}
            </div>
            <div className="buttons">
              <Button
                text="<<"
                onClick={() => {
                  if (currentImageIndex !== 0) {
                    setCurrentImageIndex(currentImageIndex - 1);
                  } else {
                    setCurrentImageIndex(imageURLs.length - 1);
                  }
                }}
              />
              <Button
                text=">>"
                onClick={() => {
                  if (currentImageIndex !== imageURLs.length - 1) {
                    setCurrentImageIndex(currentImageIndex + 1);
                  } else {
                    setCurrentImageIndex(0);
                  }
                }}
              />
            </div>
            <div className="crop">
              <Button
                text="Crop image"
                onClick={() => {
                  setIsCarouselVisible(false);
                  setIsCroppedSectionVisible(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="crop-div" style={CroppedSectionStyle}>
        <ReactCrop
          src={imageURLs[currentImageIndex].objectURL}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onImageLoaded={setImage}
        />
        <Button text="Crop" onClick={getCroppedImage} />
        {croppedImage && (
          <Image src={croppedImage} alt="Cropped Image" id="1" />
        )}
        {croppedImage && (
          <Button
            text="Save"
            onClick={() => {
              var imageURLsCopy = JSON.parse(JSON.stringify(imageURLs))
              imageURLsCopy[currentImageIndex].objectURL = croppedImage;
              setStackImageURLs([...stackImageURLs, imageURLsCopy]);
              setStackCounter(stackCounter + 1);
              setIsCroppedSectionVisible(false);
              setIsCarouselVisible(true);
            }}
          />
        )}
        <Button
          text="Cancel"
          onClick={() => {
            setIsCroppedSectionVisible(false);
            setIsCarouselVisible(true);
          }}
        />
      </div>
    </div>
  );
};

export default Carousel;
