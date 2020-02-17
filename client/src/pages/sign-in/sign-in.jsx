import React from "react";
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import "./sign-in.scss";

class SignIn extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: ""
    };
  }

  handleSubmit = async event => {
    event.preventDefault();

    const { email, password } = this.state;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      const body = JSON.stringify({ email, password });
      try {
          const res = await axios.post("/api/auth", body, config);
          this.setState({ email: "", password: "" });
          localStorage.setItem('token', res.data.token);
          console.log(res);
          this.props.history.push("/");
      } catch (err) {
        const errors = err.response.data.errors;
        errors.map( error => console.log(error.msg));
      }

    } catch (err) {
      console.log(err);
    }
  };

  handleChange = event => {
    const { value, name } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className="sign-in">
        <form onSubmit={this.handleSubmit}>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
          <button type="submit"> Sign In</button>
        </form>
      </div>
    );
  }
}

export default withRouter(SignIn);
