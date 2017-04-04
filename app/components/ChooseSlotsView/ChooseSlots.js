import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import AppBar from 'material-ui/AppBar/AppBar';
import _ from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import DoneAll from 'material-ui/svg-icons/action/done-all';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Slots from './Slots';
import getClientId from '../../utils/clientId';
import { selectTalk, getServerStore, submitChoosenTalks, refreshSlot } from '../../actions/slotsActions';

const mapStateToProps = (state) => ({
  slots: state.slots,
  voters: state.voters,
});

const mapDispatchToProps = (dispatch) => ({
  selectTalk: (period, talkId) => {
    dispatch(selectTalk(period, talkId));
  },
  refreshSlot: (period) => {
    dispatch(refreshSlot(period));
  },
  submitChoosenTalks: (slots, checkVote) => {
    dispatch(submitChoosenTalks(slots, checkVote));
  },
  goToResults: () => {
    browserHistory.push('/results');
  },
  getServerStore: () => {
    dispatch(getServerStore());
  },
});

export const ChooseSlots = React.createClass({
  propTypes: {
    slots: PropTypes.arrayOf(PropTypes.shape({
      period: PropTypes.string.isRequired,
      talks: PropTypes.array.isRequired,
    }).isRequired).isRequired,
    selectTalk: PropTypes.func.isRequired,
    submitChoosenTalks: PropTypes.func.isRequired,
    getServerStore: PropTypes.func.isRequired,
    goToResults: PropTypes.func.isRequired,
    voters: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
  },
  componentDidMount() {
    const { getServerStore } = this.props;

    getServerStore();
  },
  render() {
    let { submitChoosenTalks, goToResults, ...slots } = this.props;
    const alreadyVote = _(this.props.voters).find((voter) => voter === getClientId()) !== undefined;
    const checkAlreadyVote = this.props.route.checkVote !== undefined ? this.props.route.checkVote : true;
    let choiceComponent;
    if ((!checkAlreadyVote || !alreadyVote)) {
      choiceComponent = (<FlatButton
        label="Submit Choices"
        onTouchTap={() => {
          console.log('onTouch');
          submitChoosenTalks(choosenSlots(this.props.slots), checkAlreadyVote);
        }}
      />);
    } else {
      goToResults();
    }
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div className="container-fluid">
          <div className="row">
            <AppBar
              title="XKE Agenda"
              showMenuIconButton={false}
              iconElementRight={choiceComponent}
              style={{ position: 'fixed', backgroundColor: '#6B205F' }}
            />
          </div>
          <div className="row" style={{ paddingTop: 60 }}>
            <Slots {...slots} style />
          </div>
          {/* <div style={{ textAlign: 'right' }}>*/}
          {/* {choiceComponent}*/}
          {/* </div>*/}
        </div>
      </MuiThemeProvider>
    );
  },
});

const choosenSlots = (slots) => {
  if (slots) {
    return _(slots).map((s) => {
      const selectedTalk = s.talks.filter((t) => t.selected)[0];
      if (selectedTalk) {
        return {
          period: s.period,
          talk: selectedTalk.id,
        };
      }
      return selectedTalk;
    }).compact()
      .value();
  }
  return slots;
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseSlots);
