// var nj = require("numjs")

import { useState } from "react";
import getPixelsNumJS from "./GetPixelsNumJS";

async function GetPixels(divRef, setImgDataArray) {
  console.log("Calling getPixels");
  const imgDataArray = [];

  async function getInfo(imgElement, callback) {
    var img = new Image();
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d", { colorSpace: "display-p3" });
    // var ctx = canvas.getContext("2d");
    img.src = imgElement.src;

    // https://stackoverflow.com/a/4032188: Canvas width and height
    // var width = img.naturalWidth;
    // var width = canvas.width;
    // var width = canvas.getBoundingClientRect().width;
    // var height = img.naturalHeight;
    // var height = canvas.height;
    // var height = canvas.getBoundingClientRect().height;
    img.onload = async function () {
      ctx.drawImage(img, 0, 0);
      var width = this.width
      var height = this.height
      console.log(width, height)
      var imgData = ctx.getImageData(0, 0, width, height);
      imgDataArray.push({ array: imgData, width: width, height: height });
    };
    return(imgDataArray)
  }

  if (divRef.current !== undefined) {
    for (var i = 0; i < divRef.current.children.length; i++) {
      var imgElement =
        divRef.current.children[i].getElementsByTagName("img")[0];
      var out = await getInfo(imgElement);
      // console.log("imgDataArray", out)
    }
    setImgDataArray(imgDataArray);
  }
}

export default GetPixels;
