import React from 'react';
import type { QueueStatus } from './Types';
import { makeStyles } from '@material-ui/core/styles';

// Explicit styles
const useStyles = makeStyles({
  queueInfo: {
    position: 'absolute',
    right: '10px',
    top: '5vw',
    fontSize: '5vw'
  },
});

// Queue info component
interface QueueInfoProps {
  status: QueueStatus;
}

// Main app
const QueueInfo: React.FunctionComponent<QueueInfoProps> =
   ({ status }) =>
  {
    const classes = useStyles();

    let mmss = "";
    if (typeof status.time == "number")
    {
      const mins = Math.floor(status.time/60);
      const secs = status.time%60;
      mmss = (mins<10?"0":"")+mins+":"+(secs<10?"0":"")+secs;
    }

    return (
      <div className={classes.queueInfo}>
        { status.state === "idle" &&
          <span/>
        }
        { status.state === "waiting" && status.position === 1 &&
          <span>You're next! {mmss} to go</span>
        }
        { status.state === "waiting" && typeof status.position == "number" &&
          status.position > 1 &&
          <span>{status.position} ahead of you, {mmss} to go</span>
        }
        { status.state === "active" &&
          <span>Your turn! {mmss} remaining</span>
        }
      </div>
    );
  };

export default QueueInfo;
