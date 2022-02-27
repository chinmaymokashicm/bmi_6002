import { useState, useEffect, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import clone from "just-clone";

import Image from "./Image";
import Button from "./Button";

import GetPixels from "../functions/GetPixels";
import SaveImageURLsToStack from "../functions/SaveImageURLsToStack";
import KonvaStage from "../functions/KonvaStage";
// import Image

const Carousel = ({
  imageRef,
  stackImageURLs,
  setStackImageURLs,
  stackCounter,
  setStackCounter,
  overlayWidth,
  setOverlayWidth,
  overlayHeight,
  setOverlayHeight,
  updateOverlayDimensions,
  overlayData,
  setOverlayData,
  setImgDataArray,
}) => {
  const [isCarouselVisible, setIsCarouselVisible] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crop, setCrop] = useState();
  // { aspect: 16 / 9 }
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCroppedSectionVisible, setIsCroppedSectionVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  let carouselStyle = {
    gridTemplateColumns: "[v1] 80% [v2] 20% [v3]",
    gridTemplateRows: "[h1] 70% [h2] 30% [h3]",
    width: "100%",
    overflow: "scroll",
    gridGap: "20px",
  };
  if (!isCarouselVisible) {
    carouselStyle.display = "none";
  }
  if (isCarouselVisible) {
    carouselStyle.display = "grid";
  }

  const columns = ["id", "Image", "Size", "X", "Y", "Radius"];

  const [imageInfoTableData, setImageInfoTableData] = useState([]);

  function updateOverlayTable() {
    if (stackImageURLs[stackCounter][0].objectURL !== undefined) {
      var rows = [];
      for (let i = 0; i < stackImageURLs[stackCounter].length; i++) {
        var row = [
          i + 1,
          stackImageURLs[stackCounter][i].imageName,
          Math.floor(
            Math.log(stackImageURLs[stackCounter][i].image.size) /
              Math.log(1024)
          ) + " KB",
          overlayData[i].x,
          overlayData[i].y,
          overlayData[i].radius,
        ];
        rows.push(row);
      }
      setImageInfoTableData(rows);
    }
  }

  useEffect(() => {
    updateOverlayTable();
  }, [overlayData]);

  useEffect(() => {
    if (imageRef.current !== undefined) {
      updateOverlayDimensions();
    }
  }, [currentImageIndex]);

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
        stackCounter,
        setImgDataArray
      );
      setStackCounter(stackCounter + 1);
    } catch (e) {
      console.log(e);
    }
    setIsCroppedSectionVisible(false);
    setIsCarouselVisible(true);
    // setIsOverlayVisible(true)
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
          style={carouselStyle}
        >
          <div
            className="image-view"
            style={{
              borderColor: "azure",
              gridColumn: "v1 / v3",
              gridRow: "h1 / h2",
              backgroundColor: "blanchedalmond",
              // textAlign: "center",
              position: "relative",
              display: "flex",
              // justifyItems: "center",
              // margin: "25px 50px 75px 100px"
            }}
          >
            <div>
              {stackImageURLs[stackCounter].map((imageSrc) => (
                <div
                  key={imageSrc.id}
                  id="image-display"
                  // ref={imageSrc.id === currentImageIndex ? imageRef : null}
                  style={{
                    maxHeight: "100%",
                    height: "300px",
                    background: "pink",
                    position: "absolute",
                    // left: 0,
                    // right: 0,
                    // marginLeft: "auto",
                    // marginRight: "auto",
                    display:
                      imageSrc.id === currentImageIndex ? "flex" : "none",
                  }}
                >
                  <Image
                    alt={imageSrc.imageName}
                    id={imageSrc.id}
                    src={imageSrc.objectURL}
                    innerRef={
                      imageSrc.id === currentImageIndex ? imageRef : null
                    }
                  />
                </div>
              ))}
              {stackImageURLs[stackCounter].map((imageSrc) => (
                <div
                  className="image-display overlay"
                  key={imageSrc.id}
                  style={{
                    zindex: 9,
                    width: overlayWidth,
                    height: overlayHeight,
                    background: "rgba(200, 207, 202, 0.2)",
                    // background: "yellow",
                    position: "absolute", //https://stackoverflow.com/a/8273750
                    // left: 0,
                    // right: 0,
                    // marginLeft: "auto",
                    // marginRight: "auto",
                    opacity: "0.6",
                    display:
                      imageSrc.id === currentImageIndex
                        ? isOverlayVisible
                          ? "inline"
                          : "none"
                        : "none",
                  }}
                >
                  <KonvaStage
                    width={overlayWidth}
                    height={overlayHeight}
                    overlayData={overlayData}
                    setOverlayData={setOverlayData}
                    currentImageIndex={currentImageIndex}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            className="image-information"
            style={{
              borderStyle: "dotted",
              gridColumn: "v1 / v2",
              gridRow: "h2 / h3",
            }}
          >
            <div className="table">
              {columns.length > 1 && (
                <table align="center" border="2">
                  <thead>
                    <tr>
                      {columns.map((columnName) => (
                        <th key={columnName}>{columnName} </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {imageInfoTableData.map((row, i) => (
                      <tr
                        key={i}
                        style={{
                          backgroundColor:
                            i === currentImageIndex ? "#03dbfc" : "",
                        }}
                      >
                        {row.map((cell, j) => (
                          <td key={j}>{String(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div
            className="image-options"
            style={{
              borderStyle: "groove",
              gridColumn: "v2 / v3",
              gridRow: "h2 /h3",
            }}
          >
            <Button
              text="<<"
              onClick={() => {
                if (currentImageIndex !== 0) {
                  setCurrentImageIndex(currentImageIndex - 1);
                } else {
                  setCurrentImageIndex(stackImageURLs[stackCounter].length - 1);
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
                  // setIsOverlayVisible(false)
                }}
              />
            </div>
            <div className="overlay-options">
              <Button
                text={!isOverlayVisible ? "Show overlay" : "Hide overlay"}
                onClick={() => {
                  setIsOverlayVisible(!isOverlayVisible);
                }}
              />
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
