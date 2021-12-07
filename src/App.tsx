import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import QueueInfo from './QueueInfo';
import ImageCarousel from './ImageCarousel';
import Controls from './Controls';
import type { QueueStatus, ControlValues } from './Types';

// Deploy-specific config, read from public/config.js
type Config = {
  nexusURL: string;
  resource: string;
  graphics: {
    welcome: string[];
    queue: string[];
  };
};

declare global {
  var appConfig: Config;
}

const config = window.appConfig;

// Theme overrides
const theme = createTheme({
  palette: {
    primary: {
      main: "#00ff00"
    },
    secondary: {
      main: "#18a080"
    }
  }
});

// Explicit styles
const useStyles = makeStyles( (theme) => ({
  app: {
    width: '100vw',
    maxWidth: '500px',
    height: '100vh',
    margin: 'auto',
    position: 'relative',
    overflow: 'hidden'
  },

  header: {
    height: '40px',
    width: 'calc(100% - 20px)',
    padding: '10px',
    borderBottom: 'solid 1px #444'
  },

  join: {
    textAlign: "center"
  },

  welcomeCarousel:
  {
    height: "80%"
  },

  queueCarousel:
  {
    height: "90%"
  },

  "@keyframes zoom":
  {
    "0%": {
      opacity: 1,
    },
    "100%": {
      opacity: 0,
      transform: "scale(10)"
    }
  },

  flash:
  {
    position: "absolute",
    top: "30%",
    width: "100%",
    textAlign: "center",
    fontSize: "40px",
    color: "white",
    zIndex: 10,
    opacity: 0,
    animation: "$zoom 2s",
    pointerEvents: "none"
  }
}));

// Main app component
const NexusClient: React.FunctionComponent = () =>
  {
    const classes = useStyles();
    const webSocket = useRef(null as WebSocket | null);
    const [queueStatus, setQueueStatus] =
      useState<QueueStatus>({ state: "idle" });
    const [stateChanged, setStateChanged] = useState(false);
    let lastState = "idle";

    // Handle an inbound message
    function handleMessage(msg: string)
    {
      console.log("Got WS msg: "+msg);
      try
      {
        const json = JSON.parse(msg);
        let newState = "";
        switch (json.type)
        {
          case "qinfo":
          newState = "waiting";
          setQueueStatus({ state: "waiting",
                           position: json.position,
                           total: json.total,
                           time: json.time });
          break;

          case "active":
          newState = "active";
          setQueueStatus({ state: "active",
                           total: json.total,
                           time: json.time });
          break;

          case "timeup":
          newState = "idle";
          setQueueStatus({ state: "idle",
                           total: json.total });
          stop_ws();
          break;

          default:
          console.log("Unrecognised Nexus message "+json.type);
          return;
        }

        if (newState !== lastState)
          {
            setStateChanged(true);
            lastState = newState;
            setTimeout(() => { setStateChanged(false); }, 2000);
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
      ws.onopen = () => { join(); }
      ws.onmessage = (e: MessageEvent) => { handleMessage(e.data); };
      ws.onerror = () => { stop_ws(); }
      ws.onclose = () => { stop_ws(); }
      webSocket.current = ws;
    }

    // Stop the websocket
    function stop_ws()
    {
      if (webSocket.current && webSocket.current.readyState <= 1)
        webSocket.current.close();
      webSocket.current = null;
      setQueueStatus({ state: "idle" });
    }

    return (
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
            <p className={classes.join}>
              <Button variant="contained"
                      color="primary" size="large" onClick={start_ws}>
                Let's go!
              </Button>
            </p>
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

        { stateChanged && queueStatus.state === "active" &&
          <div className={classes.flash}>Go!</div>
        }
        { stateChanged && queueStatus.state === "idle" &&
          <div className={classes.flash}>Times up!</div>
        }
      </div>
    );
  };

const App: React.FunctionComponent = () =>
{
  return <ThemeProvider theme={theme}>
    <NexusClient/>
  </ThemeProvider>;
};

export default App;
