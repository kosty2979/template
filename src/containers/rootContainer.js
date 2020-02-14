import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import MainContainer from '@/containers/MainContainer';
import PlayerContainer from '@/containers/PlayerContainer';

const  RootContainer = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <MainContainer/>
        </Route>
        <Route path="/video/:id">
          <PlayerContainer />
        </Route>
      </Switch>
    </Router>
  );
};

export default RootContainer;
