import React from 'react';
import './App.css';
import MonacoEditor from './components/Editor';

interface AppProps {}

function App({}: AppProps) {
  return (
    <div>
      Code editor <MonacoEditor />{' '}
    </div>
  );
}

export default App;
