import { Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { useAuthWrapper } from "_helpers";

export { PrivateRoute };

function PrivateRoute({ component: Component, ...rest }) {
  const authWrapper = useAuthWrapper();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (authWrapper.tokenValue) {
          return <Component {...props} />;
        } else
          //not logged in

          return <Route path="*" element={<Navigate to="/account/login" />} />;
      }}
    />
  );
}
