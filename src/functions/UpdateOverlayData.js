import clone from "just-clone";

function UpdateOverlayData(
  overlayData,
  setOverlayData,
  overlayDataObj,
  currentImageIndex
) {
  var tempDataArray = clone(overlayData);
  tempDataArray[currentImageIndex] = overlayDataObj;
  setOverlayData(tempDataArray);
}

export default UpdateOverlayData;
