import clone from "just-clone";
import DataURLtoBlob from "./DataURLToBlob";
import GetImageDimensions from "./GetImageDimensions";
import GetPixels from "./GetPixels";
import InitiateCanvas from "./InitiateCanvas";

import SaveImageURLsToStack from "./SaveImageURLsToStack";
import SaveOverlayURLsToStack from "./SaveOverlayURLsToStack";


function Greyscale(
  imgDataArray,
  stackOverlayURLs,
  setStackOverlayURLs,
  stackCounter,
  setImgDataArray,
  setVesselDensityArray
) {
  function greyscale(
    counterImage,
    counterOverlayName,
    tempImgDataArray,
    tempOverlayURLs
  ) {
    console.log(
      counterImage,
      counterOverlayName,
      overlayNamesArray.length,
      overlayNamesArray[counterOverlayName]
    );
    if (counterImage === numImages) {
      console.log("Here");
      console.log(tempImgDataArray);
      console.log("tempOverlayURLs", tempOverlayURLs);
      setImgDataArray(tempImgDataArray);
      // var tempStackOverlayURLs = clone(stackOverlayURLs);
      // tempStackOverlayURLs[stackCounter + 1] = tempOverlayURLs;
      // console.log(tempStackOverlayURLs);
      // setStackOverlayURLs(tempStackOverlayURLs);
      SaveOverlayURLsToStack(
        tempOverlayURLs,
        stackOverlayURLs,
        setStackOverlayURLs,
        stackCounter,
        setImgDataArray
      );
      GetPixels(tempOverlayURLs, setImgDataArray)
      // setOverlayURLs(tempOverlayURLs)
      var returnArray = new Array(
        stackOverlayURLs[stackCounter].length + 1
      ).fill(true);
      return returnArray;
    }
    if (counterOverlayName === overlayNamesArray.length) {
      return greyscale(counterImage + 1, 0, tempImgDataArray, tempOverlayURLs);
    }
    var imgDataCurrent =
      tempImgDataArray[counterImage][overlayNamesArray[counterOverlayName]];
    var [canvas, ctx, img] = InitiateCanvas(
      tempOverlayURLs[counterImage][overlayNamesArray[counterOverlayName]],
      imgDataCurrent
    );
    var pixelData = imgDataCurrent.data;
    var lengthPixelData = Object.keys(pixelData).length; //To speed up the loop iteration

    // Weights
    // https://www.dynamsoft.com/blog/insights/image-processing/image-processing-101-color-space-conversion/#:~:text=the%20weighted%20method.%C2%A0-,The%20Weighted%20Method,-The%20weighted%20method
    var redWeight = 0.299;
    var greenWeight = 0.587;
    var blueWeight = 0.114;
    for (let i = 0; i < lengthPixelData; i += 4) {
      var grayscale =
        redWeight * pixelData[i] +
        greenWeight * pixelData[i + 1] +
        blueWeight * pixelData[i + 2];
      pixelData[i] = grayscale;
      pixelData[i + 1] = grayscale;
      pixelData[i + 2] = grayscale;
    }

    // console.log(grayscale);

    // Get new ImageData object
    var newImageData = ctx.createImageData(
      imgDataCurrent.width,
      imgDataCurrent.height
    );
    newImageData.data.set(pixelData);
    console.log(newImageData);
    ctx.putImageData(newImageData, 0, 0);
    // Get new imageURL
    var base64Image = canvas.toDataURL();
    var objectURL = URL.createObjectURL(DataURLtoBlob(base64Image));

    // Set the values in imgDataArray and overlayURLs
    tempImgDataArray[counterImage][overlayNamesArray[counterOverlayName]] =
      newImageData;
    tempOverlayURLs[counterImage][overlayNamesArray[counterOverlayName]] =
      objectURL;
    return greyscale(
      counterImage,
      counterOverlayName + 1,
      tempImgDataArray,
      tempOverlayURLs
    );
  }

  try {
    var tempImgDataArray = clone(imgDataArray);
    var tempOverlayURLs = clone(stackOverlayURLs[stackCounter]);
    var numImages = stackOverlayURLs[stackCounter].length;
    var overlayNamesArray = Object.keys(stackOverlayURLs[stackCounter][0]);
    return greyscale(0, 0, tempImgDataArray, tempOverlayURLs);
  } catch (e) {
    console.log(e);
    return new Array(stackOverlayURLs[stackCounter].length + 1).fill(false);
  }
}

export default Greyscale;
