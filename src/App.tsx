import React, { useEffect, useState, useRef } from 'react';
import { createMuiTheme, ThemeProvider, makeStyles }
  from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import QueueInfo from './QueueInfo';
import Controls from './Controls';

import icon from './graphics/header-icon.svg';
import config from './config.json';

// Theme overrides
const theme = createMuiTheme({
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

  logo: {
    height: '40px'
  },

  join: {
    position: 'absolute',
    left: '50px',
    top: '10px'
  },
});

// Main app
const App: React.FunctionComponent = () =>
  {
    const classes = useStyles();
    const webSocket = useRef(null as WebSocket | null);
    const [queuePosition, setQueuePosition] = useState(0);
    const [queueState, setQueueState] = useState("idle");
    const [queueTime, setQueueTime] = useState(0);

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
          setQueueState("waiting");
          setQueuePosition(json.position);
          setQueueTime(json.time);
          break;

          case "active":
          setQueueState("active");
          setQueueTime(json.time);
          break;

          case "timeup":
          setQueueState("timeup");
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
      const json = { type: "join" };
      webSocket.current && webSocket.current.send(JSON.stringify(json));
    }

    // Start the websocket
    function start_ws()
    {
      const ws = new WebSocket(config.nexusURL);
      ws.onmessage = (e: MessageEvent) => { handleMessage(e.data); };
      ws.onerror = () => { setTimeout(start_ws, 1000); };
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
            <img src={icon} aria-label='Nexus icon'
                 className={classes.logo} alt="" />
            <QueueInfo state={queueState} position={queuePosition}
                       time={queueTime} />
            <Button className={classes.join} variant="contained"
                    color="primary" onClick={join}>
              Join
            </Button>
          </header>
          { queueState === "active" && webSocket.current &&
            <Controls webSocket={webSocket.current}/>
          }
        </div>
      </ThemeProvider>
    );
  };

export default App;
