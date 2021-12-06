import React from 'react';
import type { QueueStatus } from './Types';
import { makeStyles } from '@material-ui/core/styles';

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
    verticalAlign: 'top',
    paddingRight: '20px'
  },

  queue: {
    display: 'inline-block',
    verticalAlign: 'top'
  },

  head: {
    display: 'inline-block',
    height: '32px',
    marginRight: '10px'
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
    height: '32px',
    verticalAlign: 'middle',
  },

  time: {
    display: 'inline-block',
    fontSize: '32px',
    verticalAlign: 'top',
    paddingLeft: '5px'
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
        for(let i=Math.min(status.total, maxQueueShown); i>0; i--)
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
                { showGreyCrowd &&
                  <img src={crowdGrey} className={classes.head} alt=""/> }
                { showGreenCrowd &&
                  <img src={crowdGreen} className={classes.head} alt=""/> }
                { queuers.map((us, i) =>
                  <img src={us ? headGreen : headGrey} key={i}
                       className={classes.head} alt="" />  )}
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
