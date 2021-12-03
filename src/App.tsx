import React, { useEffect, useState, useRef } from 'react';
import { createTheme, ThemeProvider, makeStyles }
  from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import QueueInfo from './QueueInfo';
import Controls from './Controls';
import type { QueueStatus, ControlValues } from './Types';

import config from './config.json';

// Theme overrides
const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: "#0392fd"
    },
    secondary: {
      main: "#18eaa2"
    }
  }
});

// Explicit styles
const useStyles = makeStyles({
  app: {
    width: '100vw'
  },

  header: {
    height: '40px',
    width: 'calc(100% - 20px)',
    padding: '10px',
    borderBottom: 'solid 1px #444'
  },

  join: {
    position: 'absolute',
    right: '10px',
    top: '10px'
  },
});

// Main app
const App: React.FunctionComponent = () =>
  {
    const classes = useStyles();
    const webSocket = useRef(null as WebSocket | null);
    const [queueStatus, setQueueStatus] =
      useState<QueueStatus>({ state: "idle" });

    // Handle an inbound message
    function handleMessage(msg: string)
    {
      console.log("Got WS msg: "+msg);
      try
      {
        const json = JSON.parse(msg);
        switch (json.type)
        {
          case "qinfo":
            setQueueStatus({ state: "waiting",
                             position: json.position,
                             total: json.total,
                             time: json.time });
          break;

          case "active":
          setQueueStatus({ state: "active",
                          total: json.total,
                          time: json.time });
          break;

          case "timeup":
          setQueueStatus({ state: "idle",
                          total: json.total });
          break;

          default:
          console.log("Unrecognised Nexus message "+json.type);
        }
      }
      catch (e)
      {
        console.log("Bad JSON");
      }
    }

    // Join the queue
    function join()
    {
      const json = { type: "join", resource: config.resource };
      webSocket.current && webSocket.current.send(JSON.stringify(json));
    }

    // Send our control values
    function updateControls(values: ControlValues)
    {
      const json = {
        type: "control",
        values: values
      };
      webSocket.current && webSocket.current.send(JSON.stringify(json));
    }

    // Start the websocket
    function start_ws()
    {
      const ws = new WebSocket(config.nexusURL);
      ws.onmessage = (e: MessageEvent) => { handleMessage(e.data); };
      ws.onerror = () => { ws.close(); };
      ws.onclose = () => { setTimeout(start_ws, 1000); };
      webSocket.current = ws;
    }

    useEffect( () => {
      start_ws();
      return () => {
        webSocket.current && webSocket.current.close();
      };
    }, []);

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.app}>
          <header className={classes.header}>
            <QueueInfo status={queueStatus}/>
            {
              queueStatus.state === "idle" &&
              <Button className={classes.join} variant="contained"
                      color="primary" onClick={join}>
                Join
              </Button>
            }
          </header>
          { queueStatus.state === "active" && webSocket.current &&
            <Controls updateControls={updateControls} />
          }
        </div>
      </ThemeProvider>
    );
  };

export default App;
