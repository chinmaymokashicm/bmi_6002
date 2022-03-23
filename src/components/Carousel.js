import { useState, useEffect, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import clone from "just-clone";
import Select from "react-select";

import Image from "./Image";
import Button from "./Button";

import questionImage from "../question.jpeg";

import GetPixels from "../functions/GetPixels";
import SaveImageURLsToStack from "../functions/SaveImageURLsToStack";
import SaveOverlayURLsToStack from "../functions/SaveOverlayURLsToStack";
import KonvaStage from "../functions/KonvaStage";
import { Tabs, Tab, AppBar } from "@material-ui/core";
import TabPanel from "./TabPanel";
import ErrorBoundary from "../functions/ErrorBoundary";
import ResetStackData from "../functions/ResetStackData";
import GetVesselDensity from "../functions/GetVesselDensity";
import { CSVLink } from "react-csv";
import { saveAs } from "file-saver";

import CreateRGBArray from "../functions/CreateRGBArray";
import CreateCSVURI from "../functions/CreateCSVURI";

const Carousel = ({
  imageRef,
  imageLabelArray,
  setImageLabelArray,
  previewSectionRef,
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
  overlayPixelsArray,
  setOverlayPixelsArray,
  vesselDensityArray,
  setVesselDensityArray,
  overlayURLs,
  setOverlayURLs,
  stackOverlayURLs,
  setStackOverlayURLs,
  currentTabValue,
  setCurrentTabValue,
  stackData,
  setStackData,
  isSubmitButtonDisabled,
  setIsSubmitButtonDisabled,
  labeledVesselDensityObj,
  imagePixelsArray,
  setImagePixelsArray,
}) => {
  useEffect(() => {
    setOverlayURLs(stackOverlayURLs[stackCounter]);
  }, [stackOverlayURLs]);

  const [isCarouselVisible, setIsCarouselVisible] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crop, setCrop] = useState();
  // { aspect: 16 / 9 }
  const [image, setImage] = useState(null);
  const [croppedImageURL, setCroppedImageURL] = useState(null);
  const [croppedImageObject, setCroppedImageObject] = useState(null);
  const [isCroppedSectionVisible, setIsCroppedSectionVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const labelsObj = [
    {
      label: "Left Superficial",
      value: "LS",
    },
    {
      label: "Left Deep",
      value: "LD",
    },
    {
      label: "Right Superficial",
      value: "RS",
    },
    {
      label: "Right Deep",
      value: "RD",
    },
  ];
  const [currentImageTypeLabel, setCurrentImageTypeLabel] = useState(null);
  const [currentImageTypeValue, setCurrentImageTypeValue] = useState(null);

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
    "Regions of Interest",
    "Label",
  ];

  const [imageInfoTableData, setImageInfoTableData] = useState([]);

  const htmlImageDataTable = (
    <table align="center" border="2" overflow-x="auto">
      <thead>
        <tr width="auto">
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
      for (
        let imageCounter = 0;
        imageCounter < stackImageURLs[stackCounter].length;
        imageCounter++
      ) {
        var row = [
          imageCounter + 1,
          stackImageURLs[stackCounter][imageCounter].imageName,
          // Math.floor(
          //   Math.log(stackImageURLs[stackCounter][i].image.size) /
          //     Math.log(1024)
          // ) + " KB",
          imageDimensions[imageCounter].width,
          imageDimensions[imageCounter].height,
          overlayData[imageCounter].x,
          overlayData[imageCounter].y,
          overlayData[imageCounter].radius,
          overlayURLs[imageCounter].innerCircle !== undefined
            ? "\u{2705}"
            : "❓",
          imageLabelArray[imageCounter] === undefined
            ? "❓"
            : imageLabelArray[imageCounter],
        ];
        rows.push(row);
      }
      setImageInfoTableData(rows);
    }
  }

  useEffect(() => {
    if (overlayPixelsArray[0] !== undefined) {
    }
  }, [overlayPixelsArray]);

  useEffect(() => {
    updateOverlayTable();
  }, [overlayData, imageLabelArray]);

  useEffect(() => {
    console.log("Change in overlayURLs");
    updateOverlayTable();
    if (overlayURLs.every((obj) => obj.innerCircle !== undefined)) {
      var tempStackOverlayURLs = clone(stackOverlayURLs);
      tempStackOverlayURLs[stackCounter] = overlayURLs;
      setStackOverlayURLs(tempStackOverlayURLs);
      console.log("Ready to grab pixel values!");
      console.log(overlayURLs);
      GetPixels(
        clone(overlayURLs),
        setOverlayPixelsArray,
        stackImageURLs[stackCounter],
        setImagePixelsArray
      );
    }
  }, [overlayURLs]);

  useEffect(() => {
    if (imageRef.current !== undefined) {
      updateOverlayDimensions();
    }
  }, [currentImageIndex, imageRef.current]);

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
        setOverlayPixelsArray
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
        <Tab label="Regions" />
      </Tabs>
    </AppBar>
  );

  function navigateLeft() {
    if (currentImageIndex !== 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(stackImageURLs[stackCounter].length - 1);
    }
  }
  function navigateRight() {
    if (currentImageIndex !== stackImageURLs[stackCounter].length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  }

  return (
    <div className="component-image-preview">
      {TabComponent}
      {stackImageURLs[stackCounter][0].objectURL !== undefined &&
        imageDimensions[currentImageIndex] !== undefined && (
          <div
            id="image-carousel"
            className="image-carousel"
            style={carouselStyle}
            tabIndex="1"
            onKeyDown={(e) => {
              console.log(e.key);
              if (e.key === "Enter") {
                setIsOverlayVisible(!isOverlayVisible);
              }
              if (e.key === "ArrowLeft") {
                navigateLeft();
              }
              if (e.key === "ArrowRight") {
                navigateRight();
              }
            }}
            ref={previewSectionRef}
          >
            <TabPanel value={currentTabValue} index={0}>
              <div
                className="image-view"
                style={{
                  borderColor: "azure",
                  // gridColumn: "v1 / v3",
                  // gridRow: "h1 / h2",
                  // backgroundColor: "blanchedalmond",
                  paddingTop: "50px",
                  paddingLeft: "50px",
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
                    // backgroundColor: "black",
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
              {overlayURLs[currentImageIndex].innerCircle !== undefined && (
                <div
                  style={{
                    borderColor: "azure",
                    gridColumn: "v1 / v3",
                    gridRow: "h1 / h2",
                    // backgroundColor: "blanchedalmond",
                    height: "100%",
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    paddingTop: "50px",
                    paddingLeft: "50px",
                    height: "500px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                  }}
                >
                  <Image
                    src={overlayURLs[currentImageIndex].innerCircle}
                    title="innerCircle"
                  />
                  <Image src={overlayURLs[currentImageIndex].IN} title="IN" />
                  <Image src={overlayURLs[currentImageIndex].II} title="II" />
                  <Image src={overlayURLs[currentImageIndex].IT} title="IT" />
                  <Image src={overlayURLs[currentImageIndex].IS} title="IS" />
                </div>
              )}
              {overlayURLs[currentImageIndex].innerCircle === undefined && (
                <div>
                  <h1>
                    Select regions of interest for <br />"
                    {stackImageURLs[stackCounter][currentImageIndex].imageName}"
                    {/* <Image src={questionImage} /> */}
                  </h1>
                </div>
              )}
            </TabPanel>
            <div
              className="image-labels"
              style={{
                gridColumn: "v2 / v3",
                gridRow: "h1 / h2",
                display: currentTabValue === 0 ? "inline-block" : "none",
              }}
            >
              Select image label
              <div className="dropdown">
                <Select
                  onChange={(e) => {
                    setCurrentImageTypeLabel(e.label);
                    setCurrentImageTypeValue(e.value);
                    var tempImageLabelArray = clone(imageLabelArray);
                    tempImageLabelArray[currentImageIndex] = e.value;
                    setImageLabelArray(tempImageLabelArray);
                    // console.log(tempImageLabelArray)
                    navigateRight();
                  }}
                  options={labelsObj}
                  label={
                    stackImageURLs[stackCounter][currentImageIndex].imageLabel
                  }
                  placeholder="Select image label"
                />
              </div>
              <div className="status">
                Status:
                <br />
                Overlay Pixel Data:{" "}
                {overlayPixelsArray.length > 0 ? "\u{2705}" : "❓"}
                <br />
                Image Pixel Data:{" "}
                {imagePixelsArray.length > 0 ? "\u{2705}" : "❓"}
                <br />
                Vessel Density:{" "}
                {vesselDensityArray.length > 0 ? "\u{2705}" : "❓"}
                <br />
                Ready to process images:{" "}
                {Object.keys(labeledVesselDensityObj).length > 0
                  ? "\u{2705}"
                  : "❓"}
                <br />
                <Button
                  text="Pixel Data"
                  onClick={() => {
                    const JSZip = require("jszip");
                    const zip = new JSZip()
                    const folder = zip.folder("pixels");
                    for (
                      let imageCounter = 0;
                      imageCounter < overlayPixelsArray.length;
                      imageCounter++
                    ) {
                      for (
                        let overlayCounter = 0;
                        overlayCounter < Object.keys(overlayPixelsArray[imageCounter]).length;
                        overlayCounter++
                      ) {
                        var overlayNamesArray = Object.keys(
                          overlayPixelsArray[imageCounter]
                        );
                        var href = CreateCSVURI(
                          CreateRGBArray(
                            overlayPixelsArray[imageCounter][
                              overlayNamesArray[overlayCounter]
                            ]
                          )
                        );
                        folder.file(
                          stackImageURLs[stackCounter][imageCounter].imageName +
                            "_" +
                            overlayNamesArray[overlayCounter],
                          href
                        );
                      }
                    }
                    zip
                      .generateAsync({ type: "blob" })
                      .then(function (content) {
                        saveAs(content, "pixels.zip");
                      });
                    // var href = CreateCSVURI(
                    //   CreateRGBArray(overlayPixelsArray[0].innerCircle)
                    // );
                    // var download = "test.csv";
                    // var link = document.createElement("a");
                    // link.setAttribute("href", href);
                    // link.setAttribute("download", download);
                    // document.body.appendChild(link);
                    // link.click();
                  }}
                  disabled={overlayPixelsArray[0] !== undefined ? false : true}
                />
              </div>
            </div>
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
                  navigateLeft();
                }}
              />
              <Button
                text=">>"
                onClick={() => {
                  navigateRight();
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
