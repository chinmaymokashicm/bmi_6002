// var nj = require("numjs")


async function GetPixels(stackImageURLs, stackCounter, setImgDataArray) {
  try {
    console.log("Calling getPixels");
    const imgDataArray = [];

    async function getInfo(objectURL) {
      var img = new Image();
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d", { colorSpace: "display-p3" });
      img.src = objectURL;
      img.onload = async function () {
        ctx.drawImage(img, 0, 0);
        var width = this.width;
        var height = this.height;
        console.log(width, height);
        var imgData = ctx.getImageData(0, 0, width, height);
        imgDataArray.push({ array: imgData, width: width, height: height });
      };
      return imgDataArray;
    }

    for (var i = 0; i < stackImageURLs[stackCounter].length; i++) {
      console.log("Here")
      var objectURL = stackImageURLs[stackCounter][i].objectURL;
      var out = await getInfo(objectURL);
    }
    setImgDataArray(imgDataArray);
  } catch (e) {
    console.log(e);
  }
}

export default GetPixels;
