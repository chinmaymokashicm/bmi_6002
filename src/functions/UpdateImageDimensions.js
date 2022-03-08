import clone from "just-clone";

async function UpdateImageDimensions(imageURLs, setImageDimensions) {
  const arrayImageDimensions = []
  async function readDimensions(counter) {
    if(counter === imageURLs.length){
      console.log("THE END")
      setImageDimensions(arrayImageDimensions)
      return(arrayImageDimensions)
    }
    var img = new Image()
    img.src = imageURLs[counter].objectURL
    img.onload = async function() {
      console.log("Image dimensions of image number ", counter, ": ", img.width, img.height)
      arrayImageDimensions.push({
        width: img.width,
        height: img.height
      })
      return(await readDimensions(counter+1))
    }
  }
  var counter = 0
  return(await readDimensions(counter))
}

export default UpdateImageDimensions;
