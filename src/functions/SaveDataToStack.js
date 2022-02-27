import clone from "just-clone";

function SaveDataToStack(obj, stackData, setStackData, stackCounter) {
  var tempData = clone(stackData[stackCounter]);
  tempData.push(obj);
  var counter = stackCounter;
  var tempStack = clone(stackData);
  // Add here: code to remove all counters after current counter (necessary when undo and then generate new stack images/data)
  tempStack[counter + 1] = tempData;
  setStackData(tempStack);
}

export default SaveDataToStack;
