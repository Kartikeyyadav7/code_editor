import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const MonacoEditor = () => {
  const [folderName, setFolderName] = useState([]);

  const [pathName, setPathName] = useState();
  const [langName, setLangName] = useState();
  const [valueName, setValueName] = useState();

  const newWs = new WebSocket('ws://localhost:8800');
  const webSocketConnection = () => {
    if (newWs) {
      newWs.onopen = (event) => {
        newWs.send(JSON.stringify({ type: 'get-folder-column' }));
      };

      newWs.onmessage = function (event) {
        const json = JSON.parse(event.data);
        try {
          if (json.type == 'update-folder-column') {
            setFolderName(json.contents);
          }
        } catch (err) {
          console.log(err);
        }
      };
    }
  };

  useEffect(() => {
    webSocketConnection();
  }, []);

  function handleEditorChange(value: any, event: any) {
    console.log('here is the current model value:', value);
    console.log('language', pathName);
    newWs.send(
      JSON.stringify({
        type: 'update-file',
        content: {
          fileName: pathName,
          fileContent: value,
        },
      }),
    );
  }

  const onBtnClick = (name: any) => {
    setPathName(name.fileName);
    setLangName(
      name.fileName.split('.')[1] === 'js'
        ? 'javascript'
        : name.fileName.split('.')[1],
    );

    setValueName(name.content);
  };

  return (
    <>
      {folderName.map((name: any) => (
        <button
          key={name.fileName}
          disabled={pathName === name.fileName}
          onClick={() => onBtnClick(name)}
        >
          {name.fileName}
        </button>
      ))}
      <Editor
        height="80vh"
        theme="vs-dark"
        path={pathName}
        defaultLanguage={langName}
        defaultValue={valueName}
        onChange={handleEditorChange}
      />

      <iframe
        src="http://localhost:5500/code/"
        width="400px"
        height="400px"
      ></iframe>
    </>
  );
};

export default MonacoEditor;
