import { useState } from "react";

function GetPixels(overlayURLs, setImgDataArray) {
  function getPixels(counterImage, counterOverlayName, tempPixelArray) {
    // console.log(counterImage, counterOverlayName, tempPixelArray);
    if (counterImage === numImages) {
      console.log(tempPixelArray);
      setImgDataArray(tempPixelArray);
      return;
    }
    if (counterOverlayName === overlayNamesArray.length) {
      getPixels(counterImage + 1, 0, tempPixelArray);
    }
    var img = new Image();
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d", { colorSpace: "display-p3" });
    img.src = overlayURLs[counterImage][overlayNamesArray[counterOverlayName]];
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      console.log(img.width, img.height);
      ctx.drawImage(img, 0, 0);
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      tempPixelArray[counterImage][overlayNamesArray[counterOverlayName]] =
        imgData;
      // console.log(overlayNamesArray[counterOverlayName], imgData.data.filter((element) => element !== 0).length);
      getPixels(counterImage, counterOverlayName + 1, tempPixelArray);
    };
  }

  try {
    console.log("Getting pixels!");
    var numImages = overlayURLs.length;
    var tempPixelArray = new Array(numImages).fill({});
    var overlayNamesArray = Object.keys(overlayURLs[0]);
    getPixels(0, 0, tempPixelArray);
  } catch (e) {
    console.log(e);
  }
}

export default GetPixels;
