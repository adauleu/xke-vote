import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton/IconButton';

export const HeaderSlot = ({ period, refreshSlot }) => (
  <div className='row'>
      <div>
        <div className='col-lg-7 col-md-7 col-xs-9' style={{paddingLeft: 30}}>
          {period}
        </div>
        <div className='col-lg-3 col-md-2 col-xs-1'>
        </div>
        <div className='pull-right' style={{paddingRight: 20}}>
          <IconButton iconClassName='material-icons'
                      onTouchTap={() => refreshSlot(period)}
                      onClick={() => refreshSlot(period)}
          >refresh</IconButton>
        </div>
    </div>
  </div>
);

HeaderSlot.propTypes = {
  period: PropTypes.string.isRequired,
  refreshSlot: PropTypes.func.isRequired
};

export default HeaderSlot;
