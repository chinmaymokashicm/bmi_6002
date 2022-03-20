function CreateLabeledVesselDensityObj(
  imageLabelArray,
  vesselDensityArray,
  setLabeledVesselDensityObj
) {
    var vesselDensityObj = {}
    for(let imageCounter=0; imageCounter<imageLabelArray.length; imageCounter++){
        vesselDensityObj[imageLabelArray[imageCounter]] = vesselDensityArray[imageCounter]
    }
    setLabeledVesselDensityObj(vesselDensityObj)
}

export default CreateLabeledVesselDensityObj;
