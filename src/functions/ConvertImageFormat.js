function ConvertImageFormat(imageFile) {
  try {
    var imageName = imageFile.name;
    // Creating an img element
    // Example: <img class="ReactCrop__image" src="blob:http://localhost:3000/7d7d870b-83e6-4ea8-9360-16b96ef8947f">
    var img = new Image();
    img.src = URL.createObjectURL(imageFile);
    var canvas = document.createElement("canvas");
    canvas.width = img.width
    canvas.height = img.height
    var ctx = canvas.getContext("2d", { colorSpace: "display-p3" });
  } catch (e) {}
}

export default ConvertImageFormat;
