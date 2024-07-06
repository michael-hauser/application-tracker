import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  exact?: boolean;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Route
      {...rest}
      Component={props =>
        user ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" />
        )}
    />
  );
};

export default PrivateRoute;
