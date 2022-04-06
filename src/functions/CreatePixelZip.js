import CreateCSV from "./CreateCSV";
import CreateRGBArray from "./CreateRGBArray";

import { saveAs } from "file-saver";

function CreatePixelZip(overlayPixelsArray, stackImageURLs, stackCounter) {
  const JSZip = require("jszip");
  const zip = new JSZip();
  const folder = zip.folder("pixels");
  for (
    let imageCounter = 0;
    imageCounter < overlayPixelsArray.length;
    imageCounter++
  ) {
    for (
      let overlayCounter = 0;
      overlayCounter < Object.keys(overlayPixelsArray[imageCounter]).length;
      overlayCounter++
    ) {
      var overlayNamesArray = Object.keys(overlayPixelsArray[imageCounter]);
      var href = CreateCSV(
        CreateRGBArray(
          overlayPixelsArray[imageCounter][overlayNamesArray[overlayCounter]]
        )
      );
      var filename =
        stackImageURLs[stackCounter][imageCounter].imageName +
        "_" +
        overlayNamesArray[overlayCounter] +
        ".csv";
      folder.file(filename, href);
    }
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "pixels.zip");
  });
}

export default CreatePixelZip;
