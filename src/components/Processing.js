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
const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

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
}) => {
  // Setting up the appearance
  const animatedComponents = makeAnimated();

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
        stackImageURLs,
        setStackImageURLs,
        stackCounter,
        setImgDataArray
      );
      for (var i = 0; i < stackImageURLs[stackCounter].length; i++) {
        objFunctionData[`Image ${i + 1}`] = functionOutput[i];
        if (functionOutput[i] === true) {
          objFunctionData[`Image ${i + 1}`] = "\u{2705}"; //Green tick emoji
        } else if (functionOutput[i] === false) {
          objFunctionData[`Image ${i + 1}`] = "\u{274C}"; //Red cross emoji
        }
        objOverlayData[`Image ${i + 1}`] = overlayData[i];
      }
      // console.log("Collected function return values");
      var outputAverage = functionOutput[functionOutput.length - 1];
      objFunctionData["Average"] =
        typeof outputAverage === "boolean"
          ? outputAverage === true
            ? "\u{2705}"
            : "\u{274C}"
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

      // console.log("Saving data to stack");
      SaveDataToStack(objData, stackData, setStackData, stackCounter);
      setStackCounter(stackCounter + 1);
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
        <Button text="Submit" onClick={Submit} />
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
