import clone from "just-clone";
import DataURLtoBlob from "./DataURLToBlob";
import GetImageDimensions from "./GetImageDimensions";
import GetPixels from "./GetPixels";
import InitiateCanvas from "./InitiateCanvas";

import SaveImageURLsToStack from "./SaveImageURLsToStack";
import SaveOverlayURLsToStack from "./SaveOverlayURLsToStack";

function Greyscale(
  overlayPixelsArray,
  stackOverlayURLs,
  setStackOverlayURLs,
  stackCounter,
  setOverlayPixelsArray,
  imagePixelsArray,
  setImagePixelsArray,
  stackImageURLs,
  setStackImageURLs
) {
  function updateOverlayURLs(
    counterImage,
    counterOverlayName,
    tempOverlayPixelsArray,
    tempOverlayURLs
  ) {
    console.log(
      counterImage,
      counterOverlayName,
      overlayNamesArray.length,
      overlayNamesArray[counterOverlayName]
    );
    if (counterImage === numImages) {
      // console.log("Here");
      // console.log(tempOverlayPixelsArray);
      // console.log("tempOverlayURLs", tempOverlayURLs);
      setOverlayPixelsArray(tempOverlayPixelsArray);
      SaveOverlayURLsToStack(
        tempOverlayURLs,
        stackOverlayURLs,
        setStackOverlayURLs,
        stackCounter,
        setOverlayPixelsArray
      );
      return
      // GetPixels(tempOverlayURLs, setOverlayPixelsArray)
    }
    if (counterOverlayName === overlayNamesArray.length) {
      updateOverlayURLs(
        counterImage + 1,
        0,
        tempOverlayPixelsArray,
        tempOverlayURLs
      );
      return
    }
    // console.log(tempOverlayPixelsArray, counterImage)
    var overlayPixelDataCurrent =
      tempOverlayPixelsArray[counterImage][
        overlayNamesArray[counterOverlayName]
      ];
    var [canvas, ctx, img] = InitiateCanvas(
      tempOverlayURLs[counterImage][overlayNamesArray[counterOverlayName]],
      overlayPixelDataCurrent
    );
    var pixelData = overlayPixelDataCurrent.data;
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
      overlayPixelDataCurrent.width,
      overlayPixelDataCurrent.height
    );
    newImageData.data.set(pixelData);
    console.log(newImageData);
    ctx.putImageData(newImageData, 0, 0);
    // Get new imageURL
    var base64Image = canvas.toDataURL();
    var objectURL = URL.createObjectURL(DataURLtoBlob(base64Image));

    // Set the values in overlayPixelsArray and overlayURLs
    tempOverlayPixelsArray[counterImage][
      overlayNamesArray[counterOverlayName]
    ] = newImageData;
    tempOverlayURLs[counterImage][overlayNamesArray[counterOverlayName]] =
      objectURL;
    return updateOverlayURLs(
      counterImage,
      counterOverlayName + 1,
      tempOverlayPixelsArray,
      tempOverlayURLs
    );
  }

  function updateImageURLs(counterImage, tempImagePixelsArray, tempImageURLs) {
    if (counterImage === numImages) {
      setImagePixelsArray(tempImagePixelsArray);
      SaveImageURLsToStack(
        stackImageURLs[stackCounter],
        stackImageURLs,
        setStackImageURLs,
        stackCounter
      );
      GetPixels(tempOverlayURLs, setOverlayPixelsArray, tempImageURLs, setImagePixelsArray)
      return;
    }
    var imagePixelDataCurrent = tempImagePixelsArray[counterImage];
    console.log(tempImagePixelsArray[counterImage], counterImage)
    var [canvas, ctx, img] = InitiateCanvas(
      stackImageURLs[stackCounter][counterImage].objectURL,
      imagePixelDataCurrent
    );
    var pixelData = imagePixelDataCurrent.data;
    var lengthPixelData = Object.keys(pixelData).length; //To speed up the loop iteration
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
    // Get new ImageData object
    var newImageData = ctx.createImageData(
      imagePixelDataCurrent.width,
      imagePixelDataCurrent.height
    );
    newImageData.data.set(pixelData);
    console.log(newImageData);
    ctx.putImageData(newImageData, 0, 0);
    // Get new imageURL
    var base64Image = canvas.toDataURL();
    var objectURL = URL.createObjectURL(DataURLtoBlob(base64Image));

    tempImagePixelsArray[counterImage] = newImageData;
    tempImageURLs[counterImage].objectURL = objectURL;
    updateImageURLs(
      counterImage + 1,
      tempImagePixelsArray,
      tempImageURLs
    );
    return
  }

  try {
    console.log(imagePixelsArray)
    var tempOverlayPixelsArray = clone(overlayPixelsArray);
    var tempImagePixelsArray = clone(imagePixelsArray);
    console.log(tempImagePixelsArray)
    var tempOverlayURLs = clone(stackOverlayURLs[stackCounter]);
    var tempImageURLs = clone(stackImageURLs[stackCounter]);
    var numImages = stackOverlayURLs[stackCounter].length;
    var overlayNamesArray = Object.keys(stackOverlayURLs[stackCounter][0]);
    updateOverlayURLs(
      0,
      0,
      tempOverlayPixelsArray,
      tempOverlayURLs
    );
    updateImageURLs(0, tempImagePixelsArray, tempImageURLs)
    // var
    // GetPixels
    return ;
  } catch (e) {
    console.error(e);
    return
  }
}

export default Greyscale;
