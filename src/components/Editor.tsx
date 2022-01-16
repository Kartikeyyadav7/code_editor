import React from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

const MonacoEditor = () => {
  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
    />
  );
};

export default MonacoEditor;
