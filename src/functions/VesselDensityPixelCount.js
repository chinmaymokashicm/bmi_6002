import GetImageDimensions from "./GetImageDimensions";
import InitiateCanvas from "./InitiateCanvas";
import SaveImageURLsToStack from "./SaveImageURLsToStack";

function VesselDensityPixelCount(
  overlayPixelsArray,
  stackImageURLs,
  setStackImageURLs,
  stackCounter,
  setOverlayPixelsArray
) {
  try {
    var arrayPixelDensity = [];
    var pixelDensityTotal = 0;
    for (
      var currentImageIndex = 0;
      currentImageIndex < overlayPixelsArray.length;
      currentImageIndex++
    ) {
      var imgData = overlayPixelsArray[currentImageIndex];
      var pixelData = imgData.array.data;
      var [canvas, ctx, img] = InitiateCanvas(
        stackImageURLs[stackCounter][currentImageIndex].objectURL,
        imgData
      );

      var lengthPixelData = Object.keys(pixelData).length; //To speed up the loop iteration
      var pixelAverageTotal = 0;
      // console.log(pixelData.subarray(0, 10));
      for (let i = 0; i < lengthPixelData; i += 4) {
        var averageRGB =
          pixelData[i] / 3 + pixelData[i + 1] / 3 + pixelData[i + 2] / 3;
        pixelAverageTotal += averageRGB;
      }
      var pixelDensity = pixelAverageTotal / (imgData.width * imgData.height);
      arrayPixelDensity.push(Math.round(pixelDensity));
      pixelDensityTotal += pixelDensity;
    }
    var pixelDensityAverage = pixelDensityTotal / overlayPixelsArray.length;
    arrayPixelDensity.push(Math.round(pixelDensityAverage));
    // console.log(arrayPixelDensity)

    SaveImageURLsToStack(
      stackImageURLs[stackCounter],
      stackImageURLs,
      setStackImageURLs,
      stackCounter,
      setOverlayPixelsArray
    );
    return arrayPixelDensity;
  } catch (e) {
    console.log(e);
    var arrayError = [];
    for (let i = 0; i < overlayPixelsArray.length + 1; i++) {
      arrayError.push(false);
    }
    return arrayError;
  }
}

export default VesselDensityPixelCount;
