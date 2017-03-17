import expect from 'expect';
import _ from 'lodash';
import {reducer} from '../src/main/core/reducer';

describe('Slots Reducers', () => {

  it('should handle SUBMIT_CHOOSEN_TALKS', () => {
    let state = {session: {status: "ACTIVE"}, voters: [],slots: [{
      period: '8h - 9h',
      talks: [{
        id: 1,
        text: 'slot1',
        selected: false,
        attendees: 0
      }, {
        id: 2,
        text: 'slot2',
        selected: false,
        attendees: 0
      }
      ]
    },
      {
        period: '9h - 10h',
        talks: [{
          id: 3,
          text: 'slot3',
          selected: false,
          attendees: 0
        }, {
          id: 4,
          selected: false,
          text: 'slot4',
          attendees: 0
        }]
      }]};

    state = reducer(state, {
      type: 'SUBMIT_CHOOSEN_TALKS',
      choosenTalks: [{period: '8h - 9h', talk: 1}, {period: '9h - 10h', talk: 4}]
    });

    let updatedTalk = _(state.slots)
        .filter(s => s.period === '8h - 9h')
        .map(s => s.talks)
        .flatten()
        .filter(t => t.id === 1)
        .first();

    expect(updatedTalk.attendees).toBe(1);

  });

  it('should start a new Session', () => {
    let slots = {am: [{
      period: '8h - 9h',
      talks: [{ id: 1, text: 'slot1', selected: false, attendees: 0}, { id: 2, text: 'slot2', selected: false, attendees: 0}] },
      {
        period: '9h - 10h',
        talks: [{ id: 3, text: 'slot3', selected: false, attendees: 0}, { id: 4, selected: false, text: 'slot4', attendees: 0}]
      }],
    pm: [{
      period: '13h - 15h',
      talks: [{ id: 5, text: 'slot5', selected: false, attendees: 0}, { id: 6, text: 'slot6', selected: false, attendees: 0}] }
      ]};

    let state = reducer(undefined, {
      type: 'START_SESSION',
      slots: slots,
      moment: 'am'
    });

    expect(state.session.status).toBe('ACTIVE');
    expect(state.slots).toEqual([{
      period: '8h - 9h',
      talks: [{ id: 1, text: 'slot1', selected: false, attendees: 0}, { id: 2, text: 'slot2', selected: false, attendees: 0}] },
      {
        period: '9h - 10h',
        talks: [{ id: 3, text: 'slot3', selected: false, attendees: 0}, { id: 4, selected: false, text: 'slot4', attendees: 0}]
      }]);

    state = reducer(undefined, {
      type: 'START_SESSION',
      slots: slots,
      moment: 'pm'
    });

    expect(state.slots).toEqual([{
      period: '13h - 15h',
      talks: [{ id: 5, text: 'slot5', selected: false, attendees: 0}, { id: 6, text: 'slot6', selected: false, attendees: 0}] }
    ]);

  });

});
