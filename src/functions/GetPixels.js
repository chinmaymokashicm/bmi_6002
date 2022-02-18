// var nj = require("numjs")

import { useState } from "react";
import getPixelsNumJS from "./GetPixelsNumJS";

async function GetPixels(divRef, setImgDataArray) {
  const imgDataArray = [];
  const imgRGBArray = [];

  function getRGBData(imgData) {
    var dataArray = imgData.data;
    var rgbArray = [];
    for (var i = 0; i < dataArray.length; i += 4) {
      rgbArray.push([dataArray[i], dataArray[i + 1], dataArray[i + 2]]);
    }
    return rgbArray;
  }

  async function getInfo(imgElement) {
    var img = new Image();
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d", { colorSpace: "display-p3" });
    // var ctx = canvas.getContext("2d");
    img.src = imgElement.src;
    var width = img.naturalWidth;
    var height = img.naturalHeight;
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      var imgData = ctx.getImageData(0, 0, width, height);
      var rgbData = getRGBData(imgData)
      imgDataArray.push(imgData)
      imgRGBArray.push(rgbData)
      setImgDataArray(imgDataArray)
      // setImgRGBArray(imgRGBArray)
    };
  }

  for (var i = 0; i < divRef.current.children.length; i++) {
    var imgElement =
      divRef.current.children[i].getElementsByTagName("img")[0];
    await getInfo(imgElement)
    // console.log("Ran GetPixels")
    // setImgDataArray(getPixelsNumJS(imgElement.src))
    // setImgRGBArray([])
  }
}

export default GetPixels;
