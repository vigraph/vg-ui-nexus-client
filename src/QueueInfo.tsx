import React from 'react';
import type { QueueStatus } from './Types';
import { makeStyles } from '@material-ui/core/styles';

import headGreen from './graphics/head-green.svg';
import headGrey from './graphics/head-grey.svg';

// Explicit styles
const useStyles = makeStyles({
  queueInfo: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    paddingTop: '10px'
  },

  time: {
    display: 'inline-block',
    width: '20vw',
    fontSize: '28px',
    verticalAlign: 'top'
  },

  queue: {
    display: 'inline-block',
    width: '50vw',
    paddingRight: '20px',
    textAlign: 'right',
    verticalAlign: 'top'
  },

  head: {
    display: 'inline-block',
    height: '40px'
  }

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
      if (typeof status.total == "number")
        for(let i=status.total; i>0; i--)
          queuers.push(i === status.position);

      return (
        <div className={classes.queueInfo}>
          <div className={classes.queue}>
            { queuers.map((us, i) =>
              <img src={us ? headGreen : headGrey} key={i}
                   className={classes.head} alt="" />  )}
          </div>
          { mmss !== "" &&
            <div className={classes.time}>{mmss}</div>
          }
        </div>
      );
  };

export default QueueInfo;
