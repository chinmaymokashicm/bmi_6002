function CreateRGBArray(imageData){
    var dataArray = Array.from(imageData.data)
    var rgbArray = [["Red", "Green", "Blue", "Alpha"]]
    while(dataArray.length) rgbArray.push(dataArray.splice(0,4))
    // for(let i=0; i<dataArray.length; i+=4){
    //     rgbArray.push([dataArray[i], dataArray[i+1], dataArray[i+2], dataArray[i+3]])
    // }
    // console.log(rgbArray)
    return(rgbArray)
}

export default CreateRGBArray;