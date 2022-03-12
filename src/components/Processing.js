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
  setCurrentTabValue
}) => {
  // Setting up the appearance
  const animatedComponents = makeAnimated();

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
  useEffect(() => {
    if (imgDataArray.length === 0) {
      console.log("imgDataArray is still empty?")
      setIsSubmitButtonDisabled(true);
    } else {
      console.log("imgDataArray is not empty!")
      setIsSubmitButtonDisabled(false);
    }
  }, [imgDataArray]);

  useEffect(() => {
    try {
      const lengthImageURLs = stackImageURLs[stackCounter].length;
      var objColumns = {
        0: "id",
        1: "Function",
        [lengthImageURLs + 2]: "Average",
      };
      for (let i = 0; i < lengthImageURLs; i++) {
        objColumns[i + 2] = `Image ${i + 1}`;
      }
      generateTableData(objColumns);
    } catch (e) {
      // console.log(e);
    }
  }, [stackCounter]);

  var functionsList = [
    {
      label: "Greyscale",
      value: function () {
        return Greyscale;
      },
    },
    {
      label: "Pixel Density",
      value: function () {
        return VesselDensityPixelCount;
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
  const [currentFunction, setCurrentFunction] = useState(
    functionsList[0].value
  );

  //   -------------------------------------------------------------------------------

  const [columns, setColumns] = useState([]);
  const [tableDataArray, setTableDataArray] = useState([]);

  function generateTableData(objColumns) {
    var arrayColumns = Object.entries(objColumns)
      .sort(([, a], [, b]) => a - b)
      .map((arr) => arr[1]);
    setColumns(arrayColumns);
    var objData = stackData[stackCounter];
    const rows = [];
    for (let rowIndex = 0; rowIndex < Object.keys(objData).length; rowIndex++) {
      var row = [];
      for (
        let columnIndex = 0;
        columnIndex < arrayColumns.length;
        columnIndex++
      ) {
        var currentColumnName = arrayColumns[columnIndex];
        var currentCell = objData[rowIndex]["function"][currentColumnName];
        // console.log(currentColumnName, currentCell);
        row.push(currentCell);
      }
      rows.push(row);
    }
    setTableDataArray(rows);
  }

  //   -------------------------------------------------------------------------------

  function Submit() {
    try {
      var objFunctionData = {
        Function: currentFunctionName,
      };
      var objOverlayData = {};
      var functionOutput = currentFunction(
        imgDataArray,
        stackOverlayURLs,
        setStackOverlayURLs,
        stackCounter,
        setImgDataArray,
        setOverlayURLs
      );
      var greenTick = "\u{2705}"
      var redCross = "\u{274C}"
      for (var i = 0; i < stackOverlayURLs[stackCounter].length; i++) {
        objFunctionData[`Image ${i + 1}`] = functionOutput[i];
        if (functionOutput[i] === true) {
          objFunctionData[`Image ${i + 1}`] = greenTick; //Green tick emoji
        } else if (functionOutput[i] === false) {
          objFunctionData[`Image ${i + 1}`] = redCross; //Red cross emoji
        }
        objOverlayData[`Image ${i + 1}`] = overlayData[i];
      }
      // console.log("Collected function return values");
      var outputAverage = functionOutput[functionOutput.length - 1];
      objFunctionData["Average"] =
        typeof outputAverage === "boolean"
          ? outputAverage === true
            ? greenTick
            : redCross
          : outputAverage;
      try {
        objFunctionData["id"] = stackData[stackCounter].length + 1;
      } catch (e) {
        objFunctionData["id"] = 1;
      }
      // console.log("finished creating function data object");
      const objData = {
        function: objFunctionData,
        overlay: objOverlayData,
      };

      SaveImageURLsToStack(
        stackImageURLs[stackCounter],
        stackImageURLs,
        setStackImageURLs,
        stackCounter,
        setImgDataArray
      );
      // console.log("Saving data to stack");
      SaveDataToStack(objData, stackData, setStackData, stackCounter);
      setStackCounter(stackCounter + 1);
      setCurrentTabValue(1)
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

      {tableDataArray.length > 0 && (
        <div className="table">
          {/* ✅ ❌ */}
          {columns.length > 1 && (
            <table align="center" border="2">
              <thead>
                <tr>
                  {columns.map((columnName) => (
                    <th key={columnName}>{columnName} </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableDataArray.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{String(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Processing;
