import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from './pages/homepage/homepage';
import Header from './components/Header/Header';
import SignIn from './pages/sign-in/sign-in';

import "./App.css";

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} /> 
          <Route path='/sign-in' component={SignIn} /> 
        </Switch> 
      </div>
    );
  }
}

export default App;
