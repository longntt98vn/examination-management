import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./containers/dashboard";
import { NotFound } from "./containers/not-found";
import { ROUTE } from "./constants/route";
import { ChangePassword } from "./containers/change-password";
import { Profile } from "./containers/profile";
import { Login } from "./containers/login";
import "./style.css";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE.DEFAULT} element={<Dashboard />} />
        <Route path={ROUTE.LOGIN} element={<Login />} />
        <Route path={ROUTE.PROFILE} element={<Profile />} />
        <Route path={ROUTE.CHANGE_PASSWORD} element={<ChangePassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
