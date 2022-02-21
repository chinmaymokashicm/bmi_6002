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
  imageURLs,
  setImageURLs,
  imgDataArray,
  stackImageURLs,
  setStackImageURLs,
  stackCounter,
  setStackCounter,
  stackData,
  setStackData,
  divRef,
}) => {
  // Setting up the appearance
  const animatedComponents = makeAnimated();
  useEffect(() => {
    if (stackImageURLs[stackCounter].length > 1) {
      const tempColumnsArray = [];
      tempColumnsArray.push({
        Header: "id",
        accessor: 1,
      });
      tempColumnsArray.push({
        Header: "Function",
        accessor: 2,
      });
      for (var i = 0; i < stackImageURLs[stackCounter].length; i++) {
        tempColumnsArray.push({
          Header: stackImageURLs[stackCounter][i].imageName,
          accessor: i + 3,
        });
      }
      tempColumnsArray.push({
        Header: "Average",
        accessor: stackImageURLs[stackCounter].length + 3,
      });

      setColumns(tempColumnsArray);
    }
  }, [stackImageURLs[stackCounter]]);

  var functionsList = [
    {
      label: "Greyscale",
      value: function () {
        return Greyscale;
      },
    },
    {
      label: "Vessel Density: Pixel Count",
      value: function () {
        return VesselDensityPixelCount;
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

  const [columns, setColumns] = useState(useMemo(() => [], []));
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [count, setCount] = useState(0);

  //   -------------------------------------------------------------------------------

  function Submit() {
    try {
      var obj = {
        Function: currentFunctionName,
      };
      var boolOutput = currentFunction(
        imgDataArray,
        stackImageURLs,
        setStackImageURLs,
        stackCounter
      );
      for (var i = 0; i < boolOutput.length; i++) {
        obj[stackImageURLs[stackCounter][i].imageName] = boolOutput[i];
      }
      obj["Average"] = "Average";
      try {
        obj["id"] = stackData[stackCounter].length + 1;
      } catch (e) {
        obj["id"] = 1;
      }
      try {
        obj["image"] = stackData[stackCounter]["image"];
      } catch (e) {
        obj["Image"] = undefined;
      }
      // setImageURLs(imageURLs);
      SaveDataToStack(obj, stackData, setStackData, stackCounter);
      setStackCounter(stackCounter + 1);
      divRef.current.scrollIntoView({ behavior: "smooth" });
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
        <Link to="image-carousel" spy={true} smooth={true}>
          <Button text="Submit" onClick={Submit} />
        </Link>
        <Button
          text="Column names"
          onClick={() => {
            console.log(columns);
          }}
        />
      </div>
      <Button
        text="Results"
        onClick={() => {
          console.log(imgDataArray);
        }}
      />
      <div className="table" />
      {/* <Table data={data} columns={columns} /> */}
    </div>
  );
};

export default Processing;
