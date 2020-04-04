import React from 'react';
import { Link, Route, useHistory, useLocation } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import Button from 'react-bootstrap/Button';

const SignOutButton = ({ firebase }) => {
  const history = useHistory();

  return(<Button  variant="info" type="button" onClick={firebase.doSignOut}>
      <Link to={ROUTES.SIGN_IN}>Sign Out </Link>
  </Button>)
};


export default withFirebase(SignOutButton);
