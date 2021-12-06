import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Wheel from '@uiw/react-color-wheel';
import { Pointer } from './ColourWheelPointer';
import { ControlValues } from './Types';

import hare from './graphics/hare.svg';
import tortoise from './graphics/tortoise.svg';

// Explicit styles
const useStyles = makeStyles({
  controls: {
    fontSize: "24px",
    padding: "10px",
    textAlign: "center",
    maxWidth: "500px"
  },

  control: {
    display: "inline-block",
    marginTop: "20px",
    whiteSpace: "nowrap",
    maxWidth: "500px"
  },

  button: {
    marginLeft: "8px",
    fontSize: "32px"
  },

  tortoise: {
    float: 'left',
    marginTop: '2px',
    height: '28px'
  },

  hare: {
    float: 'right',
    height: '32px'
  }
});

// Custom slider
const OurSlider = withStyles({
  root: {
    width: "190px",
    padding: "10px 2px"
  },
  track: {
    height: 4
  },
  rail: {
    height: 4
  }
})(Slider);

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
      const [pattern, setPattern] = useState(0);
      const [speed, setSpeed] = useState(0);

      // Send initial values on start
      useEffect( () => {
        updateControls({ pattern: pattern+1, hue: hsva.h, saturation: hsva.s,
                         speed: speed });
      }, []);

      const buttonNames = [ "1", "2", "3", "4", "5" ];
      return (
        <div className={classes.controls}>
          <Box className={classes.control}>
            {
              buttonNames.map((name: string, index: number) =>
                <Button className={classes.button} variant="contained"
                        color={index==pattern?"primary":"secondary"}
                        key={index}
                        onClick={() => {
                            setPattern(index);
                            updateControls({ pattern: index+1 });
                        }}>{name}</Button>)
            }
          </Box>
          <Box className={classes.control}>
            <Wheel
              color={hsva}
              onChange={(color) => {
                  setHsva({ ...hsva, ...color.hsva });
                  updateControls({ hue: hsva.h / 360,
                                   saturation: hsva.s / 100 });
              }}
              height={300}
              width={300}
              pointer={Pointer}
            />
          </Box>
          <Box className={classes.control} sx={{ width: 300 }}>
            <OurSlider color="secondary"
                       value={speed}
                       onChange={ (_event, newValue) => {
                           setSpeed(newValue as number);
                           updateControls({ speed: speed/100 })
                       }}
            />
            <img src={tortoise} aria-label='Tortoise'
                 className={classes.tortoise} alt="slow" />
            <img src={hare} aria-label='Hare'
                 className={classes.hare} alt="fast" />
          </Box>
        </div>
      );
    };

export default Controls;
