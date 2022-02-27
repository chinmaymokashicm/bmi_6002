import clone from "just-clone";
import DataURLtoBlob from "./DataURLToBlob";
import GetImageDimensions from "./GetImageDimensions";
import GetPixels from "./GetPixels";
import InitiateCanvas from "./InitiateCanvas";

import SaveImageURLsToStack from "./SaveImageURLsToStack";

function MakeImageZero(
  imgDataArray,
  stackImageURLs,
  setStackImageURLs,
  stackCounter,
  setImgDataArray
) {
  var arrayReturn = [];
  try {
    var arrayNewObjectURLs = [];
    for (
      var currentImageIndex = 0;
      currentImageIndex < imgDataArray.length;
      currentImageIndex++
    ) {
      var imgData = imgDataArray[currentImageIndex];
      var pixelData = imgData.array.data;

      // var img = new Image();
      // img.src = stackImageURLs[stackCounter][currentImageIndex].objectURL;
      // var canvas = document.createElement("canvas");
      // canvas.width = imgData.width;
      // canvas.height = imgData.height;
      // var ctx = canvas.getContext("2d", { csolorSpace: "display-p3" });

      var [canvas, ctx, img] = InitiateCanvas(
        stackImageURLs[stackCounter][currentImageIndex].objectURL,
        imgData
      );

      // Weights
      // https://www.dynamsoft.com/blog/insights/image-processing/image-processing-101-color-space-conversion/#:~:text=the%20weighted%20method.%C2%A0-,The%20Weighted%20Method,-The%20weighted%20method
      var redWeight = 0.299;
      var greenWeight = 0.587;
      var blueWeight = 0.114;

      var lengthPixelData = Object.keys(pixelData).length; //To speed up the loop iteration
      for (let i = 0; i < lengthPixelData; i += 4) {
        var grayscale =
          redWeight * pixelData[i] +
          greenWeight * pixelData[i + 1] +
          blueWeight * pixelData[i + 2];
        pixelData[i] = 0;
        pixelData[i + 1] = 0;
        pixelData[i + 2] = 0;
      }
      var newImageData = ctx.createImageData(imgData.width, imgData.height);
      newImageData.data.set(pixelData);
      ctx.putImageData(newImageData, 0, 0);
      var base64Image = canvas.toDataURL("image/jpeg", 1);
      arrayNewObjectURLs.push(URL.createObjectURL(DataURLtoBlob(base64Image)));
      arrayReturn.push(true);
      // console.log("Finished image number: ", currentImageIndex);
    }
    arrayReturn.push(false); //Include value for "average" as well
    var tempImageURLs = clone(stackImageURLs[stackCounter]);
    for (let i = 0; i < tempImageURLs.length; i++) {
      tempImageURLs[i].objectURL = arrayNewObjectURLs[i];
    }
    SaveImageURLsToStack(
      tempImageURLs,
      stackImageURLs,
      setStackImageURLs,
      stackCounter,
      setImgDataArray
    );
    return arrayReturn;
  } catch (e) {
    console.log(e);
    for (let i = 0; i < imgDataArray.length + 1; i++) {
      //Include value for "average" as well
      arrayReturn.push(false);
    }
    return arrayReturn;
  }
}

export default MakeImageZero;
