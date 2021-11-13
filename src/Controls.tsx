import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Wheel from '@uiw/react-color-wheel';

// Explicit styles
const useStyles = makeStyles({
  controls: {
    fontSize: "24px",
    paddingTop: "20px"
  },

  colour: {
    padding: '0',
    width: '300px'
  }
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
      const [hsva, setHsva] = useState({ h: 0, s: 0, v: 100, a: 1 });

      return (
        <div className={classes.controls}>
          <Container className={classes.colour}>
            <Wheel
              color={hsva}
              onChange={(color) => { setHsva({ ...hsva, ...color.hsva }); }}
              height={300}
              width={300}
            />
          </Container>
        </div>
      );
  };

export default Controls;
