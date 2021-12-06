import React, { useEffect, useState, useRef } from 'react';
import { createTheme, ThemeProvider, makeStyles }
  from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import QueueInfo from './QueueInfo';
import ImageCarousel from './ImageCarousel';
import Controls from './Controls';
import type { QueueStatus, ControlValues } from './Types';

import config from './config.json';

// Theme overrides
const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: "#00ff00"
    },
    secondary: {
      main: "#18a080"
    }
  }
});

// Explicit styles
const useStyles = makeStyles({
  app: {
    width: '100vw',
    height: '100vh'
  },

  header: {
    height: '40px',
    width: 'calc(100% - 20px)',
    padding: '10px',
    borderBottom: 'solid 1px #444'
  },

  join: {
    display: "block",
    margin: "auto"
  },

  welcomeCarousel:
  {
    height: "90%"
  },

  queueCarousel:
  {
    height: "100%"
  }

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
          { queueStatus.state !== "idle" &&
            <header className={classes.header}>
              <QueueInfo status={queueStatus}/>
            </header>
          }
          { queueStatus.state === "idle" &&
            <>
              <ImageCarousel images={config.graphics.welcome}
                             className={classes.welcomeCarousel}/>
              <Button className={classes.join} variant="contained"
                      color="primary" size="large" onClick={join}>
                Let's go!
              </Button>
            </>
          }
          { queueStatus.state === "waiting" &&
            <>
              <ImageCarousel images={config.graphics.queue}
                             className={classes.queueCarousel}/>
            </>
          }
          { queueStatus.state === "active" && webSocket.current &&
            <Controls updateControls={updateControls} />
          }

        </div>
      </ThemeProvider>
    );
  };

export default App;
