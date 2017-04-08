import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import AppBar from 'material-ui/AppBar/AppBar';
import _ from 'lodash';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import DoneAll from 'material-ui/svg-icons/content/send';
import Notification from 'material-ui/svg-icons/social/notifications';
import Toggle from 'material-ui/Toggle';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Slots from './Slots';
import getClientId from '../../utils/clientId';
import {
  selectTalk, getServerStore, submitChoosenTalks, refreshSlot, updateServerNotificationSubscription,
} from '../../actions/slotsActions';
const logger = console;

export function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4); // eslint-disable-line no-mixed-operators
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) { // eslint-disable-line no-plusplus
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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
    return dispatch(getServerStore());
  },
  updateServerNotificationSubscription(subscription) {
    dispatch(updateServerNotificationSubscription(subscription));
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
  getInitialState() {
    return { notifications: false };
  },
  componentWillMount() {
    navigator.serviceWorker.ready.then(swRegistration => {
      this.setState({ swRegistration });
      swRegistration.pushManager.getSubscription()
        .then(subscription => {
          logger.log('subscription:', subscription);
          const notifications = !(subscription === null);
          this.setState({ notifications });

          if (notifications) {
            logger.log('User IS subscribed.');
          } else {
            logger.log('User is NOT subscribed.');
          }

          if (Notification.permission === 'denied') {
            this.props.updateServerNotificationSubscription(null);
            logger.log('updateServerNotificationSubscription(null)')
          } else {
            this.props.updateServerNotificationSubscription(subscription);
            logger.log('updateServerNotificationSubscription(subscription)')
          }
        });
    });
  },
  componentDidMount() {
    const { getServerStore } = this.props;
    getServerStore()
      .then(() => {
        const checkAlreadyVote = this.props.route.checkVote !== undefined ? this.props.route.checkVote : true;
        const alreadyVote = _(this.props.voters).find((voter) => voter === getClientId()) !== undefined;
        if ((checkAlreadyVote && alreadyVote)) {
          const { goToResults } = this.props;
          goToResults();
        }
      });
  },
  onToggle(isInputChecked) {
    this.setState({ notifications: isInputChecked });
    if (isInputChecked) {
      this.subscribeUser();
    } else {
      this.unsubscribeUser();
    }
  },
  subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(process.env.VOTE_PUBLIC_KEY);
    navigator.serviceWorker.ready.then(swRegistration => {
      swRegistration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        })
        .then(subscription => {
          logger.log('User is subscribed.');
          this.props.updateServerNotificationSubscription(subscription);
          this.setState({ notifications: true });
        })
        .catch(err => {
          logger.log('Failed to subscribe the user: ', err);
          this.setState({ notifications: false });
        });
    });
  },
  unsubscribeUser() {
    this.state.swRegistration.pushManager.getSubscription()
      .then(subscription => subscription ? subscription.unsubscribe() : undefined)
      .catch(error => {
        logger.log('Error unsubscribing', error);
      })
      .then(() => {
        this.props.updateServerNotificationSubscription(null);
        logger.log('User is unsubscribed.');
        this.setState({ notifications: false });
      });
  },
  render() {
    const { submitChoosenTalks, goToResults, ...slots } = this.props;
    const checkAlreadyVote = this.props.route.checkVote !== undefined ? this.props.route.checkVote : true;
    const AppRightButtons = (
      <div style={{ display: 'inline-flex' }}>
        <Notification style={{ color: '#fff', height: '36px', width: '36px' }} />
        <Toggle
          style={{ marginTop: '8px' }}
          defaultToggled={!!this.state.notifications}
          onToggle={(event, isInputChecked) => this.onToggle(isInputChecked)}
        />
      </div>
    );
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div className="container-fluid">
          <div className="row">
            <AppBar
              title="XKE Agenda"
              showMenuIconButton={false}
              iconElementRight={AppRightButtons}
              iconStyleRight={{ marginTop: '12px' }}
              style={{ position: 'fixed', backgroundColor: '#6B205F' }}
            />
          </div>
          <div className="row" style={{ paddingTop: 60 }}>
            <Slots {...slots} style />
          </div>
          <FloatingActionButton
            style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: '10' }}
            label="Submit Choices"
            onTouchTap={() => {
              console.log('onTouch');
              submitChoosenTalks(choosenSlots(this.props.slots), checkAlreadyVote);
              goToResults();
            }}
          >
            <DoneAll />
          </FloatingActionButton>
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
