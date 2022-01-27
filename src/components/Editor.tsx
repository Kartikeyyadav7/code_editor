import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { XTerm } from 'xterm-for-react';
import { io } from 'socket.io-client';

const MonacoEditor = () => {
  const [folderName, setFolderName] = useState([]);

  const [pathName, setPathName] = useState();
  const [langName, setLangName] = useState();
  const [valueName, setValueName] = useState();

  const xtermRef = useRef<any>(null);

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
  const serverAddress = 'http://localhost:8800';

  const connectToSocket = (serverAddress: any) => {
    return new Promise((res) => {
      const socket = io(serverAddress);
      res(socket);
    });
  };

  const start = (serverAddress: any) => {
    connectToSocket(serverAddress)
      .then((socket: any) => {
        console.log('The socket is getting first');
        socket.on('connect', () => {
          console.log('Id', socket.id);
          console.log('Now the terminal is instantiated');

          console.log('Creating a new terminal now');

          socket.on('output', (data: any) => {
            console.log('Now I am getting data from pty', data);
            // When there is data from PTY on server, print that on Terminal.
            xtermRef.current?.terminal.write(data);
          });

          socket.emit('message', `lite-server\r`);

          xtermRef.current?.terminal.onData((data: any) => {
            console.log('Now data is being emitted', data);
            socket.emit('input', data);
          });
        });
      })
      .catch((err) => console.log('Error occured while connecting to socket'));
  };

  useEffect(() => {
    webSocketConnection();
    start(serverAddress);
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
        src="http://localhost:3000"
        onLoad={() => console.log('loaded')}
        onError={() => console.log('error')}
        width="400px"
        height="400px"
      ></iframe>
      <XTerm ref={xtermRef} />
    </>
  );
};

export default MonacoEditor;
