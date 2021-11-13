import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

// Explicit styles
const useStyles = makeStyles({
  queueInfo: {
    position: 'absolute',
    right: '10px',
    top: '8px',
    fontSize: '5vw'
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

    let mins = Math.floor(time/60);
    let secs = time%60;
    const mmss = (mins<10?"0":"")+mins+":"+(secs<10?"0":"")+secs;

    return (
      <div className={classes.queueInfo}>
        { state === "idle" &&
          <span/>
        }
        { state === "waiting" && position === 1 &&
          <span>You're next! {mmss} to go</span>
        }
        { state === "waiting" && position > 1 &&
          <span>{position} ahead of you, {mmss} to go</span>
        }
        { state === "active" &&
          <span>Your turn! {mmss} remaining</span>
        }
      </div>
    );
  };

export default QueueInfo;
