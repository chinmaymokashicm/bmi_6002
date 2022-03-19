import clone from "just-clone";

function GetVesselDensity(imgDataArray, setVesselDensityArray) {
  function calculate(counterImage, counterOverlayName) {
    if (counterImage === numImages) {
      setVesselDensityArray(tempVesselDensityArray);
      console.log(tempVesselDensityArray);
      return;
    }
    if (counterOverlayName === overlayNamesArray.length) {
      console.log("Moving to the next image!");
      return calculate(counterImage + 1, 0);
    }
    var imgDataCurrent =
      tempImgDataArray[counterImage][overlayNamesArray[counterOverlayName]];
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d", { csolorSpace: "display-p3" });
    var pixelData = imgDataCurrent.data;
    var lengthPixelData = Object.keys(pixelData).length; //To speed up the loop iteration
    // Weights
    // https://www.dynamsoft.com/blog/insights/image-processing/image-processing-101-color-space-conversion/#:~:text=the%20weighted%20method.%C2%A0-,The%20Weighted%20Method,-The%20weighted%20method
    var redWeight = 0.299;
    var greenWeight = 0.587;
    var blueWeight = 0.114;
    var rgbSum = 0;
    for (let i = 0; i < lengthPixelData; i += 4) {
      var grayscale =
        redWeight * pixelData[i] +
        greenWeight * pixelData[i + 1] +
        blueWeight * pixelData[i + 2];
      pixelData[i] = grayscale;
      pixelData[i + 1] = grayscale;
      pixelData[i + 2] = grayscale;
      rgbSum += grayscale;
    }
    var averageRGB = rgbSum / (lengthPixelData / 4);
    tempVesselDensityArray[counterImage][overlayNamesArray[counterOverlayName]] = averageRGB;
    // Get new ImageData object
    var newImageData = ctx.createImageData(
      imgDataCurrent.width,
      imgDataCurrent.height
    );
    // newImageData.data.set(pixelData);
    // ctx.putImageData(newImageData, 0, 0);
    // tempImgDataArray[counterImage][overlayNamesArray[counterOverlayName]] =
    //   newImageData;
    return calculate(counterImage, counterOverlayName + 1);
  }
  console.log("Getting vessel densities!");
  var tempImgDataArray = clone(imgDataArray);
  var tempImgData = tempImgDataArray[0];
  var numImages = tempImgDataArray.length;
  var tempVesselDensityArray = [];
  for (let i = 0; i < numImages; i++) {
    let obj = {};
    for (let key in tempImgData) {
      obj[key] = undefined;
    }
    tempVesselDensityArray.push(obj);
  }
  var overlayNamesArray = Object.keys(tempImgDataArray[0]);
  return calculate(0, 0);
}

export default GetVesselDensity;
