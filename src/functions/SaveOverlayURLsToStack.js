import clone from "just-clone";

function SaveOverlayURLsToStack(
  newOverlayURLs,
  stackOverlayURLs,
  setStackOverlayURLs,
  stackCounter,
) {
  // Add here: code to remove all counters after {current counter+1} (necessary when undo and then generate new stack images/data)

  var tempStackOverlayURLs = clone(stackOverlayURLs);
  tempStackOverlayURLs[stackCounter + 1] = newOverlayURLs;
  setStackOverlayURLs(tempStackOverlayURLs);
}

export default SaveOverlayURLsToStack;