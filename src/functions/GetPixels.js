import clone from "just-clone";
// import _ from "lodash";
// import { useState } from "react";
// import ArrayEquals from "./ArrayEquals";
// import GetVesselDensity from "./GetVesselDensity";
// import InitiateCanvas from "./InitiateCanvas";

function GetPixels(currentOverlayURLs, setOverlayPixelsArray, imageURLs, setImagePixelsArray) {
  try {
    function getOverlayPixels(counterImage, counterOverlayName, tempPixelArray) {
      if (counterImage === numImages) {
        // console.log("Reached the end!");
        // for (let i = 0; i < tempPixelArray.length; i++) {
        //   console.log(
        //     _.isEqual(
        //       tempPixelArray[0].IN.data.filter((item) => item !== 0),
        //       tempPixelArray[i].IN.data.filter((item) => item !== 0)
        //     )
        //   );
        //   console.log(_.isEqual(currentOverlayURLs[0].IN, currentOverlayURLs[i].IN))
        //   // console.log(tempPixelArray[0].IN.data.filter((item) => item !== 0));
        //   console.log(tempPixelArray[i].IN.data.filter((item) => item !== 0));
        // }
        setOverlayPixelsArray(tempPixelArray);
        console.log("overlayPixelsArray", tempPixelArray);
        return;
      }
      if (counterOverlayName === overlayNamesArray.length) {
        // console.log("Moving to the next image!");
        getOverlayPixels(counterImage + 1, 0, clone(tempPixelArray));
        return;
      }
      // console.log(counterImage, overlayNamesArray[counterOverlayName]);
      // console.log(
      //   currentOverlayURLs[counterImage][overlayNamesArray[counterOverlayName]]
      // );
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d", { colorSpace: "display-p3" });
      var img = new Image();
      img.src =
        currentOverlayURLs[counterImage][overlayNamesArray[counterOverlayName]];
      // var [canvas, ctx, img] = InitiateCanvas(
      //   currentOverlayURLs[counterImage][overlayNamesArray[counterOverlayName]]
      // );
      // console.log(
      //   counterImage,
      //   overlayNamesArray[counterOverlayName],
      //   img.src,
      //   "tempPixelArray",
      //   tempPixelArray
      // );
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        // console.log(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        tempPixelArray[counterImage][overlayNamesArray[counterOverlayName]] =
          imgData;
        // console.log("Moving to next overlayURL!");
        ctx.restore();
        // console.log(overlayNamesArray[counterOverlayName], imgData.data.filter((element) => element !== 0).length);
        getOverlayPixels(counterImage, counterOverlayName + 1, clone(tempPixelArray));
        return;
      };
    }

    function getImagePixels(counterImage, tempPixelArray){
      if(counterImage === numImages){
        console.log("imagePixelsArray", tempPixelArray)
        setImagePixelsArray(tempPixelArray)
        return;
      }
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d", { colorSpace: "display-p3" });
      var img = new Image();
      img.src = imageURLs[counterImage].objectURL
      img.onload = function(){
        console.log("You there?")
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        tempPixelArray[counterImage] = imgData
        ctx.restore()
        getImagePixels(counterImage + 1, clone(tempPixelArray))
        return
      }
    }

    console.log("Getting pixels!");
    var numImages = currentOverlayURLs.length;
    var tempPixelArray = new Array(numImages).fill({});
    // console.log("tempPixelArray", tempPixelArray)
    // console.log("Initiated empty array tempPixelArray")
    var overlayNamesArray = Object.keys(currentOverlayURLs[0]);
    // console.log(numImages, "tempPixelArray", tempPixelArray, overlayNamesArray);
    // console.log(currentOverlayURLs);
    getOverlayPixels(0, 0, clone(tempPixelArray));
    getImagePixels(0, clone(tempPixelArray))
    console.log("Hello");
    return;
  } catch (e) {
    console.error(e);
  }
}

export default GetPixels;
