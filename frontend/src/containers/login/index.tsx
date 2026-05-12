import { FundTwoTone } from "@ant-design/icons";
import styled from "styled-components";

const Wrapper = styled.div`
  background: rgb(214, 214, 214);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const StyledA = styled.a`
  text-decoration: none;
  color: black;
`;

const Container = styled.div`
  width: 1000px;
  height: 550px;
  margin: 30px auto;
  display: flex;
  background: rgb(214, 214, 214);
  border-radius: 10px;
  box-shadow:
    5px 5px 7px gray,
    -5px -5px 7px gray;
`;
const Form = styled.form`
  width: 230px;
  margin: 100px auto;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  padding: 8px;
`;
const Title = styled.h1`
  text-align: center;
  text-transform: uppercase;
  font-weight: bolder;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px;
  outline: none;
  border: none;
  border: 1px solid gray;
  border-radius: 5px;
`;
const Button = styled.button`
    width: 250px;
    margin: 8px;
    padding: 8px;
    background: purple;
    outline: none;
    border: none;
    border-radius: 20px;
    color: white;
    font-size: 17px;
    cursor: pointer;
    transition: 0.5s;

    &:hover span {
    padding-right: 30px;

    &:hover span:after {
    opacity: 1;
    right: 0;
  }
  `;
const ButtonSpan = styled.span`
  display: inline-block;
  position: relative;
  transition: 0.5s;

  &:after {
    content: "\00bb";
    position: absolute;
    opacity: 0;
    top: 0;
    right: -20px;
    transition: 0.5s;
  }
`;

const Hr = styled.hr`
  border-top: 2px solid purple;
`;
const Pic = styled.div`
  width: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: violet;
`;

export const Login = () => {
  return (
    <Wrapper>
      <Container>
        <div style={{ width: "500px" }}>
          <Form>
            <Title>Login In</Title>
            <Hr />
            <p style={{ textAlign: "center" }}>Explore the World!</p>
            <Label>Email</Label>
            <Input type="text" placeholder="Email" />
            <Label>Password</Label>
            <Input type="password" placeholder="Password" />
            <Button>
              <ButtonSpan>Submit</ButtonSpan>
            </Button>
            <p style={{ textAlign: "center" }}>
              <StyledA href="#">Forgot Password?</StyledA>
            </p>
          </Form>
        </div>
        <Pic>
          <FundTwoTone
            style={{ fontSize: "400px", color: "white" }}
            twoToneColor="#eb2f96"
          />
        </Pic>
      </Container>
    </Wrapper>
  );
};
