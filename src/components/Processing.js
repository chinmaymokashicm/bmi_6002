import React, { useState, useEffect, useMemo, useReducer } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "react-dropdown/style.css";
import Button from "./Button";
import Greyscale from "../functions/Greyscale";
import VesselDensityPixelCount from "../functions/VesselDensityPixelCount";
import Table from "./Table";
import MaterialTable from "material-table";
import clone from "just-clone";
import { Link } from "react-scroll";
import styled from "styled-components";
import SaveDataToStack from "../functions/SaveDataToStack";
import SaveImageURLsToStack from "../functions/SaveImageURLsToStack";
import MakeImageZero from "../functions/MakeImageZero";
import GetPixels from "../functions/GetPixels";
import GetImageDimensions from "../functions/GetImageDimensions";
import ResetStackData from "../functions/ResetStackData";
import GetVesselDensity from "../functions/GetVesselDensity";

const Processing = ({
  imgDataArray,
  setImgDataArray,
  stackImageURLs,
  setStackImageURLs,
  stackCounter,
  setStackCounter,
  stackData,
  setStackData,
  overlayData,
  setOverlayData,
  setOverlayURLs,
  stackOverlayURLs,
  setStackOverlayURLs,
  setCurrentTabValue,
  vesselDensityArray,
  setVesselDensityArray,
  isSubmitButtonDisabled,
  setIsSubmitButtonDisabled,
  labeledVesselDensityObj,
}) => {
  // Setting up the appearance
  const animatedComponents = makeAnimated();
  useEffect(() => {
    if (imgDataArray.length === 0) {
      console.log("imgDataArray is still empty?");
      setIsSubmitButtonDisabled(true);
    } else {
      console.log("imgDataArray is not empty!");
      GetVesselDensity(imgDataArray, setVesselDensityArray);
    }
  }, [imgDataArray]);

  useEffect(() => {
    console.log("Change in overlayData!");
    console.log(overlayData);
    ResetStackData(setStackData, stackCounter);
  }, [overlayData]);

  var functionsList = [
    {
      label: "Greyscale",
      value: function () {
        return Greyscale;
      },
    },
    {
      label: "Vessel Density",
      value: function () {
        return;
      },
    },
    {
      label: "Make everything 0",
      value: function () {
        return MakeImageZero;
      },
    },
  ];
  const [currentFunctionName, setCurrentFunctionName] = useState(
    functionsList[0].label
  );
  const [functionNamesArray, setFunctionNamesArray] = useState([]);
  const [currentFunction, setCurrentFunction] = useState(
    functionsList[0].value
  );

  //   -------------------------------------------------------------------------------
  var htmlFunctionsArray = (
    <ol>
      {functionNamesArray.map((functionName, i) => (
        <li key={i}>{functionName}</li>
      ))}
    </ol>
  );

  const [htmlProcessingDataTable, setHtmlProcessingDataTable] = useState(null);

  function generateTable() {
    var metricsArray = ["Vessel Density", "X"];
    var dataArray = [labeledVesselDensityObj, "X"];
    var columns = Object.keys(
      labeledVesselDensityObj[Object.keys(labeledVesselDensityObj)[0]]
    );
    var imagesArray = Object.keys(labeledVesselDensityObj)
    // columns.unshift("Image", "Metric");
    var htmlTable = (
      <table align="center" border="2">
        <thead >
          <th width="60" key="Image">Image</th>
          <th width="60" key="Metric">Metric</th>
          {columns.map((columnName) => (
            <th width="60" key={columnName}>{columnName}</th>
          ))}
        </thead>
        <tbody>
          {imagesArray.map((imageName, imageCounter) => (
            <tr>
              <td key={imageName} rowSpan={1}>
                {imageName}
              </td>
              <td key="Metric">
                Vessel Density
              </td>
              {columns.map((columnName, columnCounter) => (
                <td key={columnName}>
                  {labeledVesselDensityObj[imageName][columnName].toFixed(2)}
                </td>
              ))}
            </tr>
          ))}

          {/* <tr key="0">
            <td key="Image" rowSpan="2">Image</td>
            <td key="Metric">Vessel Density</td>
          </tr>
          <tr key="1">
          <td key="Metric">Vessel Density</td>
          </tr> */}
        </tbody>
      </table>
    );
    setHtmlProcessingDataTable(htmlTable);
  }
  useEffect(() => {
    console.log(labeledVesselDensityObj)
    if(Object.keys(labeledVesselDensityObj).length > 0){
      generateTable();
    }
  }, [labeledVesselDensityObj]);
  //   -------------------------------------------------------------------------------

  function Submit() {
    try {
      var objOverlayData = {};
      currentFunction(
        imgDataArray,
        stackOverlayURLs,
        setStackOverlayURLs,
        stackCounter,
        setImgDataArray,
        setVesselDensityArray
      );
      for (var i = 0; i < stackOverlayURLs[stackCounter].length; i++) {
        objOverlayData[`Image ${i + 1}`] = overlayData[i];
      }
      var functionsArray = clone(functionNamesArray);
      functionsArray.push(currentFunctionName);
      const objData = {
        function: functionsArray,
        overlay: objOverlayData,
      };
      setFunctionNamesArray(functionsArray);
      console.log("functionsArray", functionsArray);

      SaveImageURLsToStack(
        stackImageURLs[stackCounter],
        stackImageURLs,
        setStackImageURLs,
        stackCounter,
        setImgDataArray
      );
      SaveDataToStack(objData, stackData, setStackData, stackCounter);
      setStackCounter(stackCounter + 1);
      setCurrentTabValue(1);
      console.log("Running processing function!");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="main">
      <div className="dropdown">
        <Select
          onChange={(e) => {
            setCurrentFunctionName(e.label);
            setCurrentFunction(e.value);
          }}
          options={functionsList}
          label={currentFunctionName}
          components={animatedComponents}
          placeholder={currentFunctionName}
        />
      </div>
      <div className="submit">
        <Button
          text="Submit"
          onClick={Submit}
          disabled={isSubmitButtonDisabled}
        />
      </div>
      <div className="text-functions-applied">
        Functions applied:
        {functionNamesArray.length === 0 && <p>None</p>}
        {functionNamesArray.length > 0 && 
        (
          <p>{htmlFunctionsArray}</p>
          )
        }
      </div>
      <div className="table">
        {htmlProcessingDataTable !== null && htmlProcessingDataTable}
      </div>
    </div>
  );
};

export default Processing;
