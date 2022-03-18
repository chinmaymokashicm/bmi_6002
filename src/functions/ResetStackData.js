function ResetStackData(setStackData, stackCounter){
    var objData = {}
    for (let i=0; i<stackCounter + 1; i++){
        objData[i] = []
    }
    setStackData(objData)
}

export default ResetStackData