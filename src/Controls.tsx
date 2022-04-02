import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Wheel from '@uiw/react-color-wheel';
import { Pointer } from './ColourWheelPointer';
import { ControlValues } from './Types';

import fastHeart from './graphics/hearts2.svg';
import slowHeart from './graphics/heart.svg';

const showHelpTime = 5000;

// Explicit styles
const useStyles = makeStyles({
  controls: {
    position: "relative",
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

  slowHeart: {
    float: 'left',
    height: '28px'
  },

  fastHeart: {
    float: 'right',
    height: '32px'
  },

  "@keyframes fade":
  {
    "0%": {
      opacity: 0.5
    },
    "80%": {
      opacity: 0.5
    },
    "100%": {
      opacity: 0
    }
  },

  help: {
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "100%",
    minWidth: "320px",
    height: "100%",
    zIndex: 10,
    pointerEvents: "none",
    backgroundColor: "black",
    opacity: 0.5,
    animation: "$fade 5s",
    textAlign: "center"
  },

  helpPattern: {
    marginTop: "0px"
  },

  helpColour: {
    marginTop: "120px"
  },

  helpSpeed: {
    marginTop: "180px"
  }
});

// Custom slider
const OurSlider = styled(Slider)({
  width: "190px",
  padding: "10px 2px",
  '& .MuiSlider-track': {
    height: 4
  },
  '& .MuiSlider-rail': {
    height: 4
  }
});

// Custom button
const OurButton = styled(Button)({
  marginLeft: "8px",
  fontSize: "32px"
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
      const [hsva, setHsva] = useState({ h: 1, s: 1, v: 100, a: 1 });
      const [pattern, setPattern] = useState(0);
      const [speed, setSpeed] = useState(0);
      const [helpShown, setHelpShown] = useState(true);

      // Send initial values on start
      useEffect( () => {
        updateControls({ pattern: pattern+1, hue: hsva.h, saturation: hsva.s,
                         speed: speed });
      }, []);

      // Show help at start
      useEffect( () => {
        setInterval(() => { setHelpShown(false); }, showHelpTime);
      }, []);

      return (
        <div className={classes.controls}>
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
            <img src={slowHeart} aria-label='Slow'
                 className={classes.slowHeart} alt="slow" />
            <img src={fastHeart} aria-label='Fast'
                 className={classes.fastHeart} alt="fast" />
          </Box>
          { helpShown &&
            <div className={classes.help}>
              <div className={classes.helpColour}>Pick a colour</div>
              <div className={classes.helpSpeed}>Set the speed</div>
            </div>
          }
        </div>
      );
    };

export default Controls;
