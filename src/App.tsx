import React, { useEffect } from 'react';
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

  wordmark: {
    display: 'inline-block',
    float: 'right',
    height: '24px',
    marginTop: '8px'
  },
});

// Main app
const App: React.FunctionComponent = () =>
  {
    const classes = useStyles();

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
