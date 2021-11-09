import React, { useEffect, useRef } from 'react';
import { createMuiTheme, ThemeProvider, makeStyles }
  from '@material-ui/core/styles';

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
});

// Main app
const App: React.FunctionComponent = () =>
  {
    const classes = useStyles();
    const webSocket = useRef(null as WebSocket | null);

    // Start the websocket
    useEffect( () => {
      function join()
      {
        const json = { type: "join" };
        webSocket.current && webSocket.current.send(JSON.stringify(json));
      }

      const _ws = new WebSocket(config.nexusURL);
      _ws.onopen = join;

      webSocket.current = _ws;
//      this.webSocket.onmessage =
      //        (e: MessageEvent) => { this.handleFrame(e.data); };

      // Cleanup function
      return () => {
        _ws.close();
      };
    }, []);

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.app}>
          <header className={classes.header}>
            <img src={icon} aria-label='Nexus icon'
                 className={classes.logo} alt="" />
          </header>
        </div>
      </ThemeProvider>
    );
  };

export default App;
