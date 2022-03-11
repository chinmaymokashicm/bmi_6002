import { useState, useEffect, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import clone from "just-clone";

import Image from "./Image";
import Button from "./Button";

import GetPixels from "../functions/GetPixels";
import SaveImageURLsToStack from "../functions/SaveImageURLsToStack";
import KonvaStage from "../functions/KonvaStage";
import { Tabs, Tab, AppBar } from "@material-ui/core";
import TabPanel from "./TabPanel";

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
  imageDimensions,
  updateOverlayDimensions,
  overlayData,
  setOverlayData,
  setImgDataArray,
  overlayURLs,
  setOverlayURLs
}) => {
  const [isCarouselVisible, setIsCarouselVisible] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crop, setCrop] = useState();
  // { aspect: 16 / 9 }
  const [image, setImage] = useState(null);
  const [croppedImageURL, setCroppedImageURL] = useState(null);
  const [croppedImageObject, setCroppedImageObject] = useState(null);
  const [isCroppedSectionVisible, setIsCroppedSectionVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(0);

  let carouselStyle = {
    gridTemplateColumns: "[v1] 800px [v2] 1fr [v3]",
    gridTemplateRows: "[h1] 600px [h2] 1fr [h3]",
    // width: "100%",
    // overflow: "scroll",
    gridGap: "20px",
  };
  if (!isCarouselVisible) {
    carouselStyle.display = "none";
  }
  if (isCarouselVisible) {
    carouselStyle.display = "grid";
  }

  const columns = [
    "id",
    "Image",
    // "Size",
    "Width",
    "Height",
    "X",
    "Y",
    "Radius",
  ];

  const [imageInfoTableData, setImageInfoTableData] = useState([]);

  const htmlImageDataTable = (
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
              backgroundColor: i === currentImageIndex ? "#03dbfc" : "",
            }}
          >
            {row.map((cell, j) => (
              <td key={j}>{String(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  function updateOverlayTable() {
    if (
      stackImageURLs[stackCounter][0].objectURL !== undefined &&
      imageDimensions[0] !== undefined
    ) {
      var rows = [];
      for (let i = 0; i < stackImageURLs[stackCounter].length; i++) {
        var row = [
          i + 1,
          stackImageURLs[stackCounter][i].imageName,
          // Math.floor(
          //   Math.log(stackImageURLs[stackCounter][i].image.size) /
          //     Math.log(1024)
          // ) + " KB",
          imageDimensions[i].width,
          imageDimensions[i].height,
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

  useEffect(() => {
    if (imageRef.current !== undefined) {
      updateOverlayDimensions();
    }
  }, [imageRef.current]);

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
    ctx.setTransform(pixelRatio, 0, setCroppedImageURL, pixelRatio, 0, 0);
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
    setCroppedImageURL(base64Image);
    setCroppedImageObject(image);
  }

  function save() {
    try {
      var newImageURLs = clone(stackImageURLs[stackCounter]);
      newImageURLs[currentImageIndex].objectURL = croppedImageURL;
      newImageURLs[currentImageIndex].image = croppedImageObject;
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
  }

  let CroppedSectionStyle = {};
  if (!isCroppedSectionVisible) {
    CroppedSectionStyle.display = "none";
    // "inline"
  }
  if (isCroppedSectionVisible) {
    CroppedSectionStyle.display = "inline";
  }

  function handleTabs(e, index) {
    setIsOverlayVisible(false);
    setCurrentTabValue(index);
  }

  const TabComponent = (
    <AppBar position="static">
      <Tabs value={currentTabValue} onChange={handleTabs}>
        <Tab label="Images" />
        <Tab label="Circles" />
      </Tabs>
    </AppBar>
  );

  return (
    <div className="component-image-preview">
      {TabComponent}
      {stackImageURLs[stackCounter][0].objectURL !== undefined &&
        imageDimensions[currentImageIndex] !== undefined && (
          <div
            id="image-carousel"
            className="image-carousel"
            style={carouselStyle}
          >
            <TabPanel value={currentTabValue} index={0}>
              <div
                className="image-view"
                style={{
                  borderColor: "azure",
                  gridColumn: "v1 / v3",
                  gridRow: "h1 / h2",
                  backgroundColor: "blanchedalmond",
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }} // Check index.css
              >
                <div
                  id="image-display"
                  style={{
                    backgroundColor: "black",
                    width: "50%",
                    height: "70%",
                  }} // check index.css
                >
                  <div className="image-frame">
                    <Image
                      src={
                        stackImageURLs[stackCounter][currentImageIndex]
                          .objectURL
                      }
                      innerRef={imageRef}
                    />
                    {imageRef.current !== null &&
                      imageRef.current !== undefined && (
                        <div
                          className="image-frame overlay"
                          key={
                            stackImageURLs[stackCounter][currentImageIndex].id
                          }
                          style={{
                            zindex: 9,
                            width: imageRef.current.width,
                            height: imageRef.current.height,
                            background: "rgba(200, 207, 2, 0)",
                            position: "absolute", //https://stackoverflow.com/a/8273750
                            left: "0",
                            right: "0",
                            opacity: "0.6",
                            display: isOverlayVisible ? "inline-block" : "none",
                          }}
                        >
                          <KonvaStage
                            width={imageDimensions[currentImageIndex].width}
                            height={imageDimensions[currentImageIndex].height}
                            overlayData={overlayData}
                            setOverlayData={setOverlayData}
                            currentImageIndex={currentImageIndex}
                            imageRef={imageRef}
                            overlayURLs={overlayURLs}
                            setOverlayURLs={setOverlayURLs}
                            stackImageURLs={stackImageURLs}
                            stackCounter={stackCounter}
                            imageDimensions={imageDimensions}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value={currentTabValue} index={1}>
                  <div style={{
                    width: "100%",
                    height: "500px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gridTemplateRows: "1fr 1fr"
                  }}>
                  <Image src={overlayURLs[currentImageIndex].innerCircle} />
                  <Image src={overlayURLs[currentImageIndex].IN} />
                  <Image src={overlayURLs[currentImageIndex].II} />
                  <Image src={overlayURLs[currentImageIndex].IT} />
                  <Image src={overlayURLs[currentImageIndex].IS} />
                  </div>
            </TabPanel>
            <div
              className="image-information"
              style={{
                // borderStyle: "dotted",
                gridColumn: "v1 / v2",
                gridRow: "h2 / h3",
              }}
            >
              <div className="table">
                {columns.length > 1 && htmlImageDataTable}
              </div>
            </div>
            <div
              className="image-options"
              style={{
                // borderStyle: "groove",
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
                    // setIsOverlayVisible(false)
                  }}
                  style={{
                    display: currentTabValue === 0 ? "inline-block" : "none",
                  }}
                />
              </div>
              <div className="overlay-options">
                <Button
                  text={!isOverlayVisible ? "Show overlay" : "Hide overlay"}
                  onClick={() => {
                    setIsOverlayVisible(!isOverlayVisible);
                  }}
                  style={{
                    display: currentTabValue === 0 ? "inline-block" : "none",
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
        {croppedImageURL && (
          <Image src={croppedImageURL} alt="Cropped Image" id="1" />
        )}
        {croppedImageURL && <Button text="Save" onClick={save} />}
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
