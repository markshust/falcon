import React from 'react';
import { Link } from 'react-router-dom';
import logo from 'src/assets/logo.png';

const Abc = () => (
  <div>
    <div>
      <img src={logo} className="Home-logo" alt="logo" />
      <h2>test content</h2>
    </div>

    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
    </ul>
  </div>
);

export default Abc;
