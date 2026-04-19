import { Navigate } from "react-router-dom";

import { useAuthWrapper } from "_helpers";

export { PrivateRoute };

function PrivateRoute({ component: Component, children, ...rest }) {
  const authWrapper = useAuthWrapper();
  
  if (!authWrapper.tokenValue) {
    return <Navigate to="/account/login" replace />;
  }
  
  if (Component) {
    return <Component {...rest} />;
  }
  
  return children;
}
