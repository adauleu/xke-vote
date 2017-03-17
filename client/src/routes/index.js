import React from 'react';
import { Route, IndexRoute } from 'react-router';

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'components/CoreLayout';
import ChooseSlots from 'components/ChooseSlotsView/ChooseSlots';
import Votings from 'components/VotingResultsView/Votings';
import Session from 'components/SessionView/Session';

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={ChooseSlots} />
    <Route path='results' component={Votings}/>
    <Route path='session' component={Session}/>
    <Route path='free' checkVote={false} component={ChooseSlots}/>
  </Route>
);
