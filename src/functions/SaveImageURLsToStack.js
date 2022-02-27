import clone from "just-clone";
import GetImageDimensions from "./GetImageDimensions";
import GetPixels from "./GetPixels";

function SaveImageURLsToStack(
  newImageURLs,
  stackImageURLs,
  setStackImageURLs,
  stackCounter,
  setImgDataArray,
) {
  // Add here: code to remove all counters after {current counter+1} (necessary when undo and then generate new stack images/data)

  var tempStackImageURLs = clone(stackImageURLs);
  tempStackImageURLs[stackCounter + 1] = newImageURLs;
  // console.log("tempStackImageURLs", tempStackImageURLs)
  setStackImageURLs(tempStackImageURLs);

  // GetPixels(newImageURLs, setImgDataArray, GetImageDimensions(newImageURLs));
}

export default SaveImageURLsToStack;
