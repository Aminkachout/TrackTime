import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import Pointings from '../Pointages/Pointings';

const HomePage = () => (
  <div>
    <h1>Tracking Page</h1>
    <Pointings />
  </div>
);

const condition = authUser => !!authUser;

export default HomePage;
