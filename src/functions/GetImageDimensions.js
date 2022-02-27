import InitiateCanvas from "./InitiateCanvas";

function GetImageDimensions(imageURLs) {
  var arrayImageDimensions = [];
  for (let i = 0; i < imageURLs.length; i++) {
    const [canvas, ctx, img] = InitiateCanvas(imageURLs[i].objectURL);
    arrayImageDimensions.push([canvas.width, canvas.height])
    // console.log(canvas, img)
    // if(canvas.width === 0){
    //     console.log(canvas, img)
    // }
  }
  console.log(arrayImageDimensions)
  return(arrayImageDimensions)
}

export default GetImageDimensions;
