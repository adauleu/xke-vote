import React, { PropTypes } from 'react';
import Slot from './Slot';

export const Slots = ({ slots, selectTalk, refreshSlot }) => (
  <div>
    {slots.map(slot =>
      <div className='col-md-4'>
        <Slot
          key={slot.period}
          {...slot}
          onClick={selectTalk}
          refreshSlot={refreshSlot}
          id='slots'
        />
      </div>
    )}
  </div>
);

Slots.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.shape({
    period: PropTypes.string.isRequired,
    talks: PropTypes.array.isRequired
  }).isRequired).isRequired,
  selectTalk: PropTypes.func.isRequired
};

export default Slots;
