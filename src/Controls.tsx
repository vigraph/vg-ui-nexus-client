import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Slider from '@material-ui/core/Slider';
import Wheel from '@uiw/react-color-wheel';
import { ControlValues } from './Types';

// Explicit styles
const useStyles = makeStyles({
  controls: {
    fontSize: "24px",
    paddingTop: "20px"
  },

  colour: {
    padding: '0',
    width: '300px'
  },

  speed: {
    marginTop: "20px",
    width: '300px'
  }
});

// Controls component
interface ControlsProps {
  updateControls: (values: ControlValues) => void;
}

// Main app
const Controls: React.FunctionComponent<ControlsProps> =
  ({ updateControls }) =>
    {
      const classes = useStyles();
      const [hsva, setHsva] = useState({ h: 0, s: 0, v: 100, a: 1 });
      const [speed, setSpeed] = useState(0);

      // Send initial values on start
      useEffect( () => {
        updateControls({ hue: hsva.h, saturation: hsva.s, speed: speed });
      }, []);

      return (
        <div className={classes.controls}>
          <Container className={classes.colour}>
            <Wheel
              color={hsva}
              onChange={(color) => {
                setHsva({ ...hsva, ...color.hsva });
                updateControls({ hue: color.hsl.h, saturation: color.hsl.s });
              }}
              height={300}
              width={300}
            />
          </Container>
          <Container className={classes.speed}>
            <Slider
              value={speed}
              onChange={ (_event, newValue) => {
                setSpeed(newValue as number);
                updateControls({ speed: speed })
              }} />
          </Container>
        </div>
      );
  };

export default Controls;
