import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/user";
import { useEffect } from "react";
import { ROUTE } from "../constants/route";
import { refreshLogin } from "../apis/auth";

export const useRefreshLogin = () => {
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate(ROUTE.LOGIN);
    } else {
      refreshLogin().then((res) => {
        console.log(res);
        if (window.location.pathname === ROUTE.LOGIN) {
          navigate(ROUTE.DEFAULT);
        }
      });
    }
  }, []);
};
