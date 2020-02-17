import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from './pages/homepage/homepage';
import Header from './components/Header/Header';
import SignIn from './pages/sign-in/sign-in';
import Reservation from './pages/reservation/reservation';

import setAuthToken from './utils/setAuthToken';

import "./App.css";

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} /> 
          <Route path='/sign-in'>{
            localStorage.token ? <Redirect to='/' /> : <SignIn />
          }</Route> 
          <Route path='/reservation' component={Reservation} /> 
        </Switch> 
      </div>
    );
  }
}

export default App;
