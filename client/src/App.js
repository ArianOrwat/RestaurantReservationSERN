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

  constructor() {
    super();
    this.state = {
      logIn: false
    }
  }

  logInState = () => {
    console.log(this.state);
    this.setState((prevState) => ({logIn: !prevState.logIn}))
  }

  render() {
    return (
      <div className="App">
        <Header login={this.state.logIn} logInState={() => this.logInState()} />
        <Switch>
          <Route exact path='/' component={HomePage} /> 
          <Route path='/sign-in'>{
            this.state.logIn ? <Redirect to='/' /> : <SignIn logInState={() => this.logInState()} />
          }</Route>
          <Route path='/reservation' component={Reservation} /> 
        </Switch> 
      </div>
    );
  }
}

export default App;
