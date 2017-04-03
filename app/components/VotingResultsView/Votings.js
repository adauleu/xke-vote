import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import TalkProgressBar from './TalkProgressBar';
import AppBar from 'material-ui/AppBar/AppBar';
import Paper from 'material-ui/Paper/Paper';
import {updateVotes} from '../../actions/slotsActions';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const mapStateToProps = (state) => ({
  slots: state.slots,
  max: state.voters.length
});

const mapDispatchToProps = (dispatch) => ({
  updateVotes: (state) => {
    dispatch(updateVotes(state));
  }
});

const paperStyle = {
  margin: 20
};

export const Votings = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    slots: PropTypes.arrayOf(PropTypes.shape({
      period: PropTypes.string.isRequired,
      talks: PropTypes.array.isRequired
    }).isRequired).isRequired,
    max: PropTypes.number.isRequired
  },

  render: function () {
    let { slots, max } = this.props;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div className='container-fluid'>
          <div className='row'>
            <AppBar title='Resultats des votes' showMenuIconButton={false} style={{backgroundColor: '#6B205F'}}/>
          </div>
          <div className='row'>
            {slots.map(slot =>
              <div className='col-lg-6' key={slot.id}>
                <Paper style={paperStyle} zDepth={2}>
                  <div className='row'>
                    <h5 style={{marginLeft: '30'}}>{slot.period}</h5>
                  </div>
                  <div className='row'>
                    {slot.talks.map(talk =>
                      <TalkProgressBar
                        key={talk.id}
                        text={talk.text}
                        attendees={talk.attendees}
                        fondation={talk.fondation}
                        room={talk.room}
                        max={max}
                      />
                    )}
                  </div>
                </Paper>
              </div>
            )}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Votings);
