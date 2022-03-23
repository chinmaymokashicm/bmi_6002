import clone from "just-clone";

function SaveImageURLsToStack(
  newImageURLs,
  stackImageURLs,
  setStackImageURLs,
  stackCounter
) {
  // Add here: code to remove all counters after {current counter+1} (necessary when undo and then generate new stack images/data)

  var tempStackImageURLs = clone(stackImageURLs);
  tempStackImageURLs[stackCounter + 1] = newImageURLs;
  // console.log("tempStackImageURLs", tempStackImageURLs)
  setStackImageURLs(tempStackImageURLs);

  // GetPixels(newImageURLs, setOverlayPixelsArray, GetImageDimensions(newImageURLs));
}

export default SaveImageURLsToStack;
