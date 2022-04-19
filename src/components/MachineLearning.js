// import { Tensor, InferenceSession } from "onnxjs";
// import { readFileSync } from "fs"
// import * as tf from "@tensorflow/tfjs"

import { useEffect, useState } from "react";

// import

const MachineLearning = ({ labeledVesselDensityObj }) => {
  const [prediction, setPrediction] = useState(null);

  function predict(objVesselDensity, intercept, featuresCoeff) {
    const labels = Object.keys(objVesselDensity);
    var prediction = intercept;
    labels.map((label) => {
      prediction += objVesselDensity[label] * featuresCoeff[label];
    });
    prediction = 1 / (1 + Math.exp(-prediction));
    return prediction;
  }

  function calculate() {
    const featuresCoeff = {
      II: 0.17599289,
      IN: 0.03895522,
      IS: -0.23797869,
      IT: -0.14315607,
      innerCircle: 0.17464724,
    };

    const intercept = 4.60635652;

    console.log(labeledVesselDensityObj);

    var objVesselDensity = {};
    const regions = Object.keys(labeledVesselDensityObj["LS"]);
    regions.map((region) => {
      objVesselDensity[region] =
        (labeledVesselDensityObj["LD"][region] +
          labeledVesselDensityObj["LS"][region] +
          labeledVesselDensityObj["RD"][region] +
          labeledVesselDensityObj["RS"][region]) /
        4;
    });
    const output = predict(objVesselDensity, intercept, featuresCoeff);
    console.log(output);
    setPrediction(output);
  }

  useEffect(() => {
    if(labeledVesselDensityObj["LS"] !== undefined){
      calculate()
    }
  }, [labeledVesselDensityObj])

  return <div>
    {prediction !== null && (
      <span>
        Probability of acute stroke: {Math.round(prediction * 100)}%
      </span>
    )}
    </div>
};

export default MachineLearning;
