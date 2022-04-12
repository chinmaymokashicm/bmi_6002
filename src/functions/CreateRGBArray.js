function CreateRGBArray(imageData) {
  //   var dataArray = Array.from(imageData.data);
  var dataArray = [];
  imageData.data.map((item) => {
    dataArray.push(item);
  });
  var rgbArray = [["Red", "Green", "Blue", "Alpha"]];
  while (dataArray.length) {
    let rgba = dataArray.splice(0, 4);
    if (rgba[3] !== 0) {
      rgbArray.push(rgba);
    }
  }
  // for(let i=0; i<dataArray.length; i+=4){
  //     rgbArray.push([dataArray[i], dataArray[i+1], dataArray[i+2], dataArray[i+3]])
  // }
  // console.log(rgbArray);
  return rgbArray;
}

export default CreateRGBArray;
