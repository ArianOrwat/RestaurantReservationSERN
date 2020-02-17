import React from "react";
import { Switch, Route } from 'react-router-dom';

import HomePage from './pages/homepage/homepage';
import Header from './components/Header/Header';
import SignIn from './pages/sign-in/sign-in';
import Reservation from './pages/reservation/reservation';

import "./App.css";

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} /> 
          <Route path='/sign-in' component={SignIn} /> 
          <Route path='/reservation' component={Reservation} /> 
        </Switch> 
      </div>
    );
  }
}

export default App;
