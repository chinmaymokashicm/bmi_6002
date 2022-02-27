function InitiateCanvas(imgSrc, imgData = undefined) {
  var img = new Image();
  img.src = imgSrc;
  var canvas = document.createElement("canvas");
  if (imgData !== undefined) {
    canvas.width = imgData.width;
    canvas.height = imgData.height;
  }
  else{
      canvas.width = img.width
      canvas.height = img.height
  }
  var ctx = canvas.getContext("2d", { csolorSpace: "display-p3" });
  return([canvas, ctx, img])
}

export default InitiateCanvas;
