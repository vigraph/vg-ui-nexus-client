import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// Explicit styles
const useStyles = makeStyles({
  controls: {
    fontSize: "24px",
    padding: "8px"
  },
});

// Controls component
interface ControlsProps {
  webSocket: WebSocket
}

// Main app
const Controls: React.FunctionComponent<ControlsProps> =
  ({ webSocket }) =>
    {
      const classes = useStyles();

      return (
        <div className={classes.controls}>
          <Container>
            <div>Controls go here!</div>
          </Container>
        </div>
      );
  };

export default Controls;
