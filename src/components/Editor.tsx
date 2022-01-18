import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import files from '../utils/files';

const MonacoEditor = () => {
  const [fileName, setFileName] = useState('script.js');
  const [number, setNumber] = useState(1);
  const file = files[fileName];

  let res;
  const fetchHtml = async () => {
    res = await fetch('http://localhost:5000/');
    const text = await res.text();
    console.log(text);
    setFileName(text);
  };
  // const fetchCss = async () => {
  //   const res = await fetch('http://localhost:5000/style.css');
  //   const text = await res.text();
  //   console.log(text);
  // };

  // const fetchJS = async () => {
  //   const res = await fetch('http://localhost:5000/script.js');
  //   const text = await res.text();
  //   console.log(text);
  // };
  const handleClick = () => {
    setNumber(number + 1);
  };

  useEffect(() => {
    fetchHtml();
    // fetchCss();
    // fetchJS();
  }, [number]);

  return (
    <>
      {/* <button
        disabled={fileName === 'script.js'}
        onClick={() => setFileName('script.js')}
      >
        script.js
      </button>
      <button
        disabled={fileName === 'style.css'}
        onClick={() => setFileName('style.css')}
      >
        style.css
      </button>
      <button
        disabled={fileName === 'index.html'}
        onClick={() => setFileName('index.html')}
      >
        index.html
      </button> */}
      <div>{number}</div>
      <button onClick={handleClick}>+</button>
      <Editor
        height="80vh"
        theme="vs-dark"
        // path="file:///E:/Learning/react-snowpack-typescript/src/project/file.html"
        // path={res.url}
        // defaultLanguage={file.language}
        // defaultValue={file.value}
        defaultLanguage="html"
        defaultValue={fileName}
      />
    </>
  );
};

export default MonacoEditor;
