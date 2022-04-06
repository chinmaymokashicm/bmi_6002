import DataURLtoBlob from "./DataURLToBlob";

function CreateCSV(rgbArray) {
  // let csvContent = "data:text/csv;charset=utf-8,";
  // rgbArray.forEach((rowArray) => {
  //   let row = rowArray.join(",");
  //   csvContent += row + "\r\n";
  // });

  // var encodedURI = encodeURI(csvContent);

  var csv = rgbArray.map((row) => {
    return(row.join(","))
  }).join("\n")

  // return URL.createObjectURL(new Blob(rgbArray, {type: "text/csv"}));
  // console.log("Created CSV data", csv)
  return(csv)
}

export default CreateCSV;
