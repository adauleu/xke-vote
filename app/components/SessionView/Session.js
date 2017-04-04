import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import AppBar from 'material-ui/AppBar/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { startSession, terminateSession, getServerStore } from '../../actions/slotsActions';

export const Session = React.createClass({

  propTypes: {
    startSession: PropTypes.func.isRequired,
    terminateSession: PropTypes.func.isRequired,
    session: PropTypes.shape({
      status: PropTypes.string,
    }).isRequired,
  },
  componentDidMount() {
    const { getServerStore } = this.props;

    getServerStore();
  },

  render() {
    let { startSession, terminateSession } = this.props;
    let sessionButton;
    if (this.props.session.status === 'ACTIVE') {
      sessionButton = (
        <RaisedButton primary label="Terminate Session" onClick={() => terminateSession()} />
      );
    } else {
      sessionButton = (
        <div>
          <RaisedButton primary label="Start Morning Session" style={{ marginRight: '10px' }} onClick={() => startSession('am')} />
          <RaisedButton primary label="Start Afternoon Session" onClick={() => startSession('pm')} />
        </div>
      );
    }
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div className="container-fluid">
          <div className="row">
            <AppBar title="XKE Agenda" showMenuIconButton={false} style={{ backgroundColor: '#6B205F' }} />
          </div>
          <div className="row">
            <div className="col-lg-6">
              {sessionButton}
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  },
});

const mapStateToProps = (state) => ({
  session: state.session,
});


export default connect(
  mapStateToProps,
  {
    startSession,
    terminateSession,
    getServerStore,
  }
)(Session);
