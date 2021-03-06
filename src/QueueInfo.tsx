import React from 'react';
import type { QueueStatus } from './Types';
import { makeStyles } from '@mui/styles';

import headGreen from './graphics/head-green.svg';
import headGrey from './graphics/head-grey.svg';
import crowdGreen from './graphics/crowd-green.svg';
import crowdGrey from './graphics/crowd-grey.svg';
import clockGreen from './graphics/clock-green.svg';
import clockGrey from './graphics/clock-grey.svg';

const maxQueueShown = 5;

// Explicit styles
const useStyles = makeStyles({
  queueInfo: {
    height: "40px",
    position: "relative"
  },

  status: {
    position: "absolute",
    top: "5px",
    left: "5px"
  },

  position: {
    display: 'inline-block',
    fontSize: '32px',
    lineHeight: '32px',
    verticalAlign: 'top',
    paddingRight: '12px'
  },

  queue: {
    display: 'inline-block',
    verticalAlign: 'top',
    paddingTop: '4px'
  },

  head: {
    display: 'inline-block',
    height: '26px',
    marginRight: '4px'
  },

  go: {
    display: 'inline-block',
    fontSize: '32px',
    fontWeight: 'bold',
    verticalAlign: 'top',
    color: '#0f0'
  },

  clockTime: {
    position: "absolute",
    top: "5px",
    right: "10px"
  },

  clock: {
    display: 'inline-block',
    verticalAlign: 'middle',
    height: '32px'
  },

  time: {
    display: 'inline-block',
    fontSize: '32px',
    fontFamily: 'monospace',
    verticalAlign: 'top',
    lineHeight: '32px',
    paddingLeft: '5px',
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

      // Build reverse order queuers array
      let queuers: boolean[] = [];  // True if it's us
      let showGreyCrowd = false;
      let showGreenCrowd = false;
      if (typeof status.total == "number")
      {
        for(let i=1; i <= Math.min(status.total, maxQueueShown); i++)
          queuers.push(i === status.position);

        if (status.total > maxQueueShown)
        {
          if (typeof status.position == "number" &&
              status.position > maxQueueShown)
            showGreenCrowd = true;
          else
            showGreyCrowd = true;
        }
      }

      return (
        <div className={classes.queueInfo}>
          <div className={classes.status}>
            { typeof status.position == "number" &&
              <div className={classes.position}>#{status.position}</div>
            }
            { status.state === "waiting" &&
              <div className={classes.queue}>
                { queuers.map((us, i) =>
                  <img src={us ? headGreen : headGrey} key={i}
                       className={classes.head} alt="" />  )}
                { showGreyCrowd &&
                  <img src={crowdGrey} className={classes.head} alt=""/> }
                { showGreenCrowd &&
                  <img src={crowdGreen} className={classes.head} alt=""/> }
              </div>
            }
            { status.state === "active" &&
              <div className={classes.go}>Your go!</div>
            }
          </div>
          <div className={classes.clockTime}>
            { status.state === "waiting" &&
              <img src={clockGrey} className={classes.clock} alt=""/> }
            { status.state === "active" &&
              <img src={clockGreen} className={classes.clock} alt=""/> }
            { mmss !== "" &&
              <div className={classes.time}>{mmss}</div>
            }
          </div>
        </div>
      );
  };

export default QueueInfo;
