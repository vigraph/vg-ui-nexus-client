import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

// Explicit styles
const useStyles = makeStyles({
  queueInfo: {
    width: '80vw',
    position: 'absolute',
    right: '10px',
    top: '8px',
    fontSize: '30px'
  },
});

// Queue info component
interface QueueInfoProps {
  state: string;
  position: number;
  time: number;
}

// Main app
const QueueInfo: React.FunctionComponent<QueueInfoProps> =
   ({ state, position, time }) =>
  {
    const classes = useStyles();

    return (
      <div className={classes.queueInfo}>
        {state}:
        {position}:
        {time}
      </div>
    );
  };

export default QueueInfo;
