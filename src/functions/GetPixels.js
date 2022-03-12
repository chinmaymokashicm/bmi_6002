// var nj = require("numjs")

import { useState } from "react";

// async function GetPixels(imageURLs, setImgDataArray, arrayImageDimensions) {

//   try {
//     console.log("Calling getPixels");
//     console.log("arrayImageDimensions", arrayImageDimensions)
//     const imgDataArray = [];

//     async function getInfo(objectURL, imageDimensions) {
//       var img = new Image();
//       console.log("GetPixels")
//       var canvas = document.createElement("canvas");
//       var ctx = canvas.getContext("2d", { colorSpace: "display-p3" });
//       img.src = objectURL;
//       // canvas.width = img.width
//       // canvas.height = img.height
//       canvas.width = imageDimensions.width
//       canvas.height = imageDimensions.height
//       img.onload = async function () {
//         ctx.drawImage(img, 0, 0);
//         var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height); //Switched to canvas.width
//         imgDataArray.push({ array: imgData, width: canvas.width, height: canvas.height });
//       };
//       return imgDataArray;
//     }

//     for (var i = 0; i < imageURLs.length; i++) {
//       var objectURL = imageURLs[i].objectURL;
//       var out = await getInfo(objectURL, arrayImageDimensions[i]);
//     }
//     setImgDataArray(imgDataArray);
//   } catch (e) {
//     console.log(imageURLs)
//     console.log(e);
//   }
// }

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
