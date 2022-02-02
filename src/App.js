import './App.css';
import { useEffect, useState } from "react";
import useCollapse from "react-collapsed";

function App() {
  // Hooks related to files

  const [files, setFiles] = useState([]);
  const [fileURLs, setFileURLs] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  const fileOnChange = (e) => {
    setFiles(e.target.files);
    const fileNamesArray = [];
    for (var i = 0; i < e.target.files.length; i++) {
      fileNamesArray.push(e.target.files[i].name);
    }
    setFileNames(fileNamesArray);
  };

  useEffect(
    (fileNames) => {
      if (files.length < 1 || files.length > 10) return;
      const newObjectURLs = [];
      for (var i = 0; i < files.length; i++) {
        const objectURL = {
          id: i,
          fileName: fileNames[i],
          objectURL: URL.createObjectURL(files[i]),
        };
        newObjectURLs.push(objectURL);
      }
      setFileURLs(newObjectURLs);
    },
    [files]
  );


  return (
    <div className="App">
      
    </div>
  );
}

export default App;
