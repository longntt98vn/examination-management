import { FundTwoTone } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import {
  ButtonSpan,
  Hr,
  Input,
  Label,
  LoginContainer,
  LoginTitle,
  LognButton,
  Pic,
  StyledA,
  Wrapper,
} from "../../constants/styles";
import { useRefreshLogin } from "../../hooks/useRefreshLogin";
import { login } from "../../apis/auth";
import { setToken } from "../../utils/user";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  useRefreshLogin();

  const FORM_ID = "login-form";
  const { handleSubmit, register } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await login(data);
      setToken(response.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <LoginContainer>
        <form
          id={FORM_ID}
          onSubmit={handleSubmit(onSubmit)}
          style={{
            height: "100%",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
          <LoginTitle>Học viện Kỹ thuật Quân sự</LoginTitle>
          <Hr />
          <p style={{ textAlign: "center" }}>Đăng nhập vào hệ thống!</p>
          <Label>Tài khoản</Label>
          <Input
            type="text"
            placeholder="Tài khoản"
            {...register("username")}
          />
          <Label>Mật khẩu</Label>
          <Input
            type="password"
            placeholder="Mật khẩu"
            {...register("password")}
          />
          <LognButton type="submit" form={FORM_ID}>
            <ButtonSpan>Đăng nhập</ButtonSpan>
          </LognButton>
          <p style={{ textAlign: "center" }}>
            <StyledA href="#">Quên mật khẩu?</StyledA>
          </p>
        </form>
        <Pic>
          <FundTwoTone
            style={{ fontSize: "400px", color: "white" }}
            twoToneColor="#eb2f96"
          />
        </Pic>
      </LoginContainer>
    </Wrapper>
  );
};
