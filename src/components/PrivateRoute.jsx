import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Protects any routes nested inside it.  When the user is not
 * authenticated we send them to the login page; otherwise we render
 * the child route(s) via <Outlet />.
 *
 * This keeps the authentication check in one place instead of
 * passing `isLogin` down through props every time.
 */
const PrivateRoute = () => {
  const { isLogin } = useContext(AuthContext);

  if (!isLogin) {
    // user isn't logged in; redirect to login and replace history entry
    return <Navigate to="/login" replace />;
  }

  // user is authenticated — render whatever child routes were matched
  return <Outlet />;
};

export default PrivateRoute;
