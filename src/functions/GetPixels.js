// var nj = require("numjs")

import { useState } from "react";


async function GetPixels(stackImageURLs, stackCounter, setImgDataArray) {

  try {
    console.log("Calling getPixels");
    const imgDataArray = [];

    async function getInfo(objectURL) {
      var img = new Image();
      console.log("GetPixels")
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d", { colorSpace: "display-p3" });
      img.src = objectURL;
      canvas.width = img.width
      canvas.height = img.height
      img.onload = async function () {
        ctx.drawImage(img, 0, 0);
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height); //Switched to canvas.width
        imgDataArray.push({ array: imgData, width: canvas.width, height: canvas.height });
      };
      return imgDataArray;
    }

    for (var i = 0; i < stackImageURLs[stackCounter].length; i++) {
      var objectURL = stackImageURLs[stackCounter][i].objectURL;
      var out = await getInfo(objectURL);
    }
    setImgDataArray(imgDataArray);
  } catch (e) {
    console.log(e);
  }
}

export default GetPixels;
