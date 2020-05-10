import React, { ComponentType } from 'react';
import {
  Route as RouterDOMRoute,
  RouteProps as RouterDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends RouterDOMRouteProps {
  isPrivated?: boolean;
  component: ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivated = false,
  component: Component,
  ...props
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <RouterDOMRoute
      {...props}
      render={({ location }) => {
        return isAuthenticated() === isPrivated ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivated ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
