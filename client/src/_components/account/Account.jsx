import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { authAtom, initClassAtom } from "_state";
import { Login, PasswordRecover } from "./";

export { Account };

function Account() {
  const auth = useRecoilValue(authAtom);
  const classPicked = useRecoilValue(initClassAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-8 offset-sm-2 mt-5">
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="passwordrecover" element={<PasswordRecover />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
