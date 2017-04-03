import React from 'react';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';
import {getFondationStyle} from '../fondations.js';
import Avatar from 'material-ui/Avatar/Avatar';

import {colors} from 'material-ui/styles';

const style = {
  margin: 10
};

export const TalkProgressBar = ({ text, attendees, fondation, room, max }) => (
  <div className='container-fluid'>
    <div className='row ' style={style}>
      <div className='col-md-1'>
        <Avatar
          color={colors.white}
          backgroundColor={getFondationStyle(fondation).color}
          style={{fontSize: '13px', top: '-px'}}
        >
          {attendees}
        </Avatar>
      </div>
      <div className='col-md-11'>
        <div className='row'>
          <div className='col-md-8'>
            {text}
            <div style={{fontWeight: 'bold'}}>Salle : {room}</div>
          </div>
          <div className='col-md-12'>
            <LinearProgress mode='determinate'
                            value={attendees}
                            max={max}
                            style={{height: '5px'}}
                            color={getFondationStyle(fondation).color}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TalkProgressBar;
