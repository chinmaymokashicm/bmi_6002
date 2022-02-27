// var nj = require("numjs")

import { useState } from "react";


async function GetPixels(imageURLs, setImgDataArray, arrayImageDimensions) {

  try {
    console.log("Calling getPixels");
    const imgDataArray = [];

    async function getInfo(objectURL, imageDimensions) {
      var img = new Image();
      console.log("GetPixels")
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d", { colorSpace: "display-p3" });
      img.src = objectURL;
      // canvas.width = img.width
      // canvas.height = img.height
      canvas.width = imageDimensions[0]
      canvas.height = imageDimensions[1]
      img.onload = async function () {
        ctx.drawImage(img, 0, 0);
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height); //Switched to canvas.width
        imgDataArray.push({ array: imgData, width: canvas.width, height: canvas.height });
      };
      return imgDataArray;
    }

    for (var i = 0; i < imageURLs.length; i++) {
      var objectURL = imageURLs[i].objectURL;
      var out = await getInfo(objectURL, arrayImageDimensions[i]);
    }
    setImgDataArray(imgDataArray);
  } catch (e) {
    console.log(imageURLs)
    console.log(e);
  }
}

export default GetPixels;
