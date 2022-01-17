import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import files from '../utils/files';

const MonacoEditor = () => {
  const [fileName, setFileName] = useState('script.js');
  const file = files[fileName];
  return (
    <>
      <button
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
      </button>
      <Editor
        height="80vh"
        theme="vs-dark"
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
      />
    </>
  );
};

export default MonacoEditor;
