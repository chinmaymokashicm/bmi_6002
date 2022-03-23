import DataURLtoBlob from "./DataURLToBlob";

function CreateCSVURI(rgbArray) {
  let csvContent = "data:text/csv;charset=utf-8,";
  rgbArray.forEach((rowArray) => {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  var encodedURI = encodeURI(csvContent);

  // return URL.createObjectURL(new Blob(rgbArray, {type: "text/csv"}));
  return(encodedURI)
}

export default CreateCSVURI;
