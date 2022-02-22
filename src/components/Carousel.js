import { useState, useEffect, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import clone from "just-clone";

import Image from "./Image";
import Button from "./Button";

import GetPixels from "../functions/GetPixels";
import SaveImageURLsToStack from "../functions/SaveImageURLsToStack";
// import Image

const Carousel = ({
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

  let CarouselStyle = {
    "grid-template-columns": "80% 20%",
    "grid-template-rows": "100%"
  };
  // let CarouselStyle = {}
  if (!isCarouselVisible) {
    CarouselStyle.display = "none";
  }
  if (isCarouselVisible) {
    CarouselStyle.display = "grid";
  }

  function getCroppedImage() {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d", { colorSpace: "display-p3" });

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

  function save() {
    try {
      var newImageURLs = clone(stackImageURLs[stackCounter]);
      newImageURLs[currentImageIndex].objectURL = croppedImage;
      SaveImageURLsToStack(
        newImageURLs,
        stackImageURLs,
        setStackImageURLs,
        stackCounter
      );
      setStackCounter(stackCounter + 1);
    } catch (e) {
      console.log(e);
    }
    setIsCroppedSectionVisible(false);
    setIsCarouselVisible(true);
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
    <div className="component-image-preview">
      {stackImageURLs[stackCounter][0].objectURL !== undefined && (
        <div
          id="image-carousel"
          className="image-carousel"
          style={CarouselStyle}
        >
          <div className="image-view" >
            {stackImageURLs[stackCounter].map((imageSrc) => (
              <div key={imageSrc.id} id="image-display">
                <Image
                  alt={imageSrc.imageName}
                  id={imageSrc.id}
                  src={imageSrc.objectURL}
                  isVisible={
                    imageSrc.id === currentImageIndex ? "inline" : "none"
                  }
                />
              </div>
            ))}
          </div>
          <div className="image-view-other">
            <div className="image-information">
              {stackImageURLs[stackCounter][currentImageIndex].id + 1}
              <br />
              {stackImageURLs[stackCounter][currentImageIndex].imageName}|<br />
              {stackImageURLs[stackCounter][currentImageIndex].image.size}
              <br />
            </div>
            <div className="image-options">
              <Button
                text="<<"
                onClick={() => {
                  if (currentImageIndex !== 0) {
                    setCurrentImageIndex(currentImageIndex - 1);
                  } else {
                    setCurrentImageIndex(
                      stackImageURLs[stackCounter].length - 1
                    );
                  }
                }}
              />
              <Button
                text=">>"
                onClick={() => {
                  if (
                    currentImageIndex !==
                    stackImageURLs[stackCounter].length - 1
                  ) {
                    setCurrentImageIndex(currentImageIndex + 1);
                  } else {
                    setCurrentImageIndex(0);
                  }
                }}
              />
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
        </div>
      )}
      <div className="crop-div" style={CroppedSectionStyle}>
        <ReactCrop
          src={stackImageURLs[stackCounter][currentImageIndex].objectURL}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onImageLoaded={setImage}
        />
        <Button text="Crop" onClick={getCroppedImage} />
        {croppedImage && (
          <Image src={croppedImage} alt="Cropped Image" id="1" />
        )}
        {croppedImage && <Button text="Save" onClick={save} />}
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
