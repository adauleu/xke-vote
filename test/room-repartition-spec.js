import expect from 'expect';
import _ from 'lodash';
import {reducer} from '../src/main/core/reducer';

describe('Slots Reducers', () => {

  it('should handle room repartition when session is over', () => {
    let state = {
      session: {status: "ACTIVE"}, voters: [], slots: [
        {
          period: '8h - 9h',
          talks: [{id: 1, text: 'slot1', selected: false, attendees: 25},
            {id: 2, text: 'slot2', selected: false, attendees: 50},
            {id: 3, text: 'slot3', selected: false, attendees: 10}]
        },
        {
          period: '9h - 10h',
          talks: [{id: 8, text: 'slot4', selected: false, attendees: 15},
            {id: 4, selected: false, text: 'slot5', attendees: 50},
            {id: 5, selected: false, text: 'slot6', attendees: 14},
            {id: 6, selected: false, text: 'slot7', attendees: 16},
            {id: 7, selected: false, text: 'slot8', attendees: 3}
          ] }]
    };

    state = reducer(state, {
      type: 'TERMINATE_SESSION'
    });

    console.log(JSON.stringify(state));

    expect(findSlot(state.slots, '8h - 9h', 1).room).toBe('Montmartre');
    expect(findSlot(state.slots, '8h - 9h', 2).room).toBe('Monceau');
    expect(findSlot(state.slots, '8h - 9h', 3).room).toBe('Haussman');
    expect(findSlot(state.slots, '9h - 10h', 4).room).toBe('Monceau');
    expect(findSlot(state.slots, '9h - 10h', 5).room).toBe('Eiffel');
    expect(findSlot(state.slots, '9h - 10h', 6).room).toBe('Montmartre');
    expect(findSlot(state.slots, '9h - 10h', 7).room).toBe('Studio');
    expect(findSlot(state.slots, '9h - 10h', 8).room).toBe('Haussman');
  });

  it('should handle room repartition when session is over with equality, inverted id is used in this case', () => {
    let state = {
      session: {status: "ACTIVE"}, voters: [], slots: [
        {
          period: '8h - 9h',
          talks: [{id: 1, text: 'slot1', selected: false, attendees: 15},
            {id: 2, text: 'slot2', selected: false, attendees: 50},
            {id: 3, text: 'slot3', selected: false, attendees: 15}]
        }
      ]
    };

    state = reducer(state, {
      type: 'TERMINATE_SESSION'
    });

    expect(findSlot(state.slots, '8h - 9h', 1).room).toBe('Haussman');
    expect(findSlot(state.slots, '8h - 9h', 2).room).toBe('Monceau');
    expect(findSlot(state.slots, '8h - 9h', 3).room).toBe('Montmartre');
  });

  it('should handle room repartition when some session has already a room indicated', () => {
    let state = {
      session: {status: "ACTIVE"}, voters: [], slots: [
        {
          period: '8h - 9h',
          talks: [{id: 1, text: 'slot1', selected: false, attendees: 5},
            {id: 2, text: 'slot2', selected: false, attendees: 50, room: 'Montmartre'},
            {id: 3, text: 'slot3', selected: false, attendees: 15}]
        }
      ]
    };

    state = reducer(state, {
      type: 'TERMINATE_SESSION'
    });

    expect(findSlot(state.slots, '8h - 9h', 1).room).toBe('Haussman');
    expect(findSlot(state.slots, '8h - 9h', 2).room).toBe('Montmartre');
    expect(findSlot(state.slots, '8h - 9h', 3).room).toBe('Monceau');
  });

  const findSlot = (slots, period, id) => {
    return _(slots)
        .filter(s => s.period === period)
        .map(s => s.talks)
        .flatten()
        .filter(t => t.id === id)
        .first();
  };
});
