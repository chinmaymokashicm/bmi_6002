import React, { useState, useEffect, useMemo, useReducer } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "react-dropdown/style.css";
import Button from "./Button";
import Greyscale from "../functions/Greyscale";
import VesselDensityPixelCount from "../functions/VesselDensityPixelCount";
import Table from "./Table";
import MaterialTable from "material-table";
import styled from "styled-components";
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
  imgDataArray,
  setImgDataArray,
  stackCounter,
  setStackCounter,
  data,
  setData
}) => {
  // Setting up the appearance
  const animatedComponents = makeAnimated();
  useEffect(() => {
    if (imageURLs.length > 1) {
      const tempColumnsArray = [];
      tempColumnsArray.push({
        Header: "id",
        accessor: 1,
      });
      tempColumnsArray.push({
        Header: "Function",
        accessor: 2,
      });
      for (var i = 0; i < imageURLs.length; i++) {
        tempColumnsArray.push({
          Header: imageURLs[i].imageName,
          accessor: i + 3,
        });
      }
      tempColumnsArray.push({
        Header: "Average",
        accessor: imageURLs.length + 3,
      });

      setColumns(tempColumnsArray);
    }
  }, [imageURLs]);

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
    var obj = {
      Function: currentFunctionName,
    };
    for (var i = 0; i < imageURLs.length; i++) {
      obj[imageURLs[i].imageName] = currentFunction(imgDataArray[i]);
    }
    obj["Average"] = "Average";
    obj["id"] = data.length + 1;
    var tempArray = data;
    tempArray.push(obj);
    setData(tempArray)
    forceUpdate();
    setCount((previous) => previous + 1);
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
        <Button
          text="Column names"
          onClick={() => {
            console.log(columns);
          }}
        />
        <Button
          text="Data"
          onClick={() => {
            console.log(data);
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
