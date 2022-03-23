import Button from "./Button";
import { saveAs } from "file-saver";

const HelpSection = ({ isHelpVisible, setIsHelpVisible }) => {
  const columns = ["Command", "Action"];
  const commandsArray = [
    ["i", "Toggles Help Section"],
    ["Esc", "Escapes Help Section"],
    ["o", "Opens File Browser"],
    ["Enter", "Opens overlay in the Preview Section"],
    ["Left and Right Arrow keys", "Browse through the uploaded images"],
  ];

  const htmlCommandsTable = (
    <table align="center" border="2" overflow-x="auto" width="95%">
      <thead>
        <tr width="auto">
          {columns.map((columnName) => (
            <th key={columnName}>{columnName} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {commandsArray.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{String(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div
      className="help"
      style={{
        position: "fixed",
        display: isHelpVisible ? "inline-block" : "none",
        top: "20%",
        right: "30%",
        height: "40%",
        width: "40%",
        borderColor: "red",
        borderStyle: "solid",
        backgroundColor: "#f0d4ad",
        overflowY: "scroll",
        opacity: "0.8",
        zIndex: "10",
        padding: "10px",
      }}
    >
      <h2 align="center">Predict potential of acute stroke from OCTA images</h2>
      <p>
        This is a purely client-side web-application which can be used to
        predict the risk of acute stroke in a patient using non-invasive OCTA
        retinal images.
      </p>
      <p>
        {" "}
        <em>
          The following excerpt has been sourced from a paper written by
          <strong> Dr. Luca Giancardo</strong> et. al at the School of
          Biomedical Informatics,
          <strong>
            {" "}
            University of Texas Health Science Center at Houston
          </strong>{" "}
          (UTHealth) in collaboration with McGovern Medical School, UTHealth and
          School of Medicine and Public Health,{" "}
          <strong> University of Wisconsin-Madison</strong>, which was the
          inspiration behind creating this web-application.
        </em>
      </p>
      <p
        style={{
          backgroundColor: "#918f6c",
          padding: "2px",
        }}
      >
        <cite>
          Increased risk of cerebrovascular disease has been documented after
          prolonged exposure to ionizing radiation on Earth and recently on the
          International Space Station. During space missions, a precise
          diagnosis of acute ischemic stroke (AIS) is difficult due to the lack
          of brain imaging capabilities. Retinal imaging systems, on the other
          hand, have been deployed in space missions, and may serve as an
          alternative. In particular, optical coherence tomography angiogram
          (OCT-A) is a new imaging approach that enables the visualization of
          microvasculature in the retina, a central nervous system structure
          with direct connections to the brain. A retinal imaging system that
          could probe cerebrovascular pathophysiology would enable the prompt
          delivery of lifesaving treatment for the astronauts on the space
          mission.
        </cite>
        {/* <p>
          <em>
            <u> Additional References: </u>
            <br/>[1] J. Lee et al., “Eyeballing stroke: Blood flow
            alterations in the eye and visual impairments following transient
            middle cerebral artery occlusion in adult rats,” Cell Transplant,
            vol. 29, Jan. 2020,
            <a href="http://dx.doi.org/10.1177/0963689720905805" target="_blank">
              doi:10.1177/0963689720905805
            </a>
          </em>
        </p> */}
      </p>
      <h3>How to use this application?</h3>
      <p>
        Please note that this application is still under development. As of now,
        I am working on calculating the vessel density of the selected regions.
        <h4>Objective</h4>
        Predict the potential of acute stroke using a patient's retinal images
        <h4>Data</h4>
        There are 4 OCTA images that need to be selected.
        <ol>
          <li>Superficial layer of the left eye</li>
          <li>Deep layer of the left eye</li>
          <li>Superficial layer of the right eye</li>
          <li>Deep layer of the right eye</li>
        </ol>
        The <strong>ROSE dataset</strong> contains several of such images. 
        {/* Click{" "} */}
        {/* <Button
          text="Here"
          onClick={() => {
            const JSZip = require("jszip");
            const zip = new JSZip();
            const folder = zip.folder("files");
            folder.file("Right_Deep.png", "../files/Angio Retina_OD-Deep.png");
            folder.file("Right_Superficial.png", "../files/Angio Retina_OD-Superficial.png");
            folder.file("Left_Deep.png", "../files/Angio Retina_OS-Deep.png");
            folder.file("Left_Superficial.png", "../files/Angio Retina_OS-Superficial.png");
            zip.generateAsync({ type: "blob" }).then(function (content) {
              saveAs(content, "files.zip");
            });
          }}
        /> */}
        {/* here to download a small sample. */}
        <h4>Steps</h4>
        <p>
            <ol>
                <li>
                    Select images (should not be more than 4)
                </li>
                <li>
                    Select regions of interest using the overlay tool.
                    Look at the table below for feedback from the application.
                </li>
                <li>
                    Label the images into any of the four labels provided.
                    Note- do not assign one label to multiple images.
                </li>
                <li>
                    Apply image processing algorithms to pre-process your data.
                </li>
                <li>
                    Run machine learning model on the data to and get the prediction.
                </li>
            </ol>
        </p>
      </p>
      <div>
          <p>
              Here are some keyboard commands included for better usability-
          </p>
          {htmlCommandsTable}</div>
    </div>
  );
};

export default HelpSection;
