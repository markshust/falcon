import React from 'react';
import { Link } from 'react-router-dom';
import logo from 'src/assets/logo.png';

const Login = () => (
  <div>
    <div>
      <img src={logo} className="Home-logo" alt="logo" />
      <h2>Log in to @deity</h2>
    </div>

    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
    </ul>
  </div>
);

export default Login;
