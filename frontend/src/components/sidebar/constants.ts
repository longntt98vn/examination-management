import styled, { keyframes } from "styled-components";
import { StudentButton } from "./StudentButton";

export const theme = {
  primary: "#3a0ca3",
  primaryLight: "#4361ee",
  secondary: "#7209b7",
  success: "#4cc9f0",
  danger: "#f72585",
  warning: "#f8961e",
  info: "#4895ef",
  dark: "#1a1a2e",
  light: "#f8f9fa",
  border: "#e9ecef",
  text: "#2d3748",
  textLight: "#718096",
  shadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  shadowSm: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  shadowLg:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  radius: "10px",
  radiusSm: "6px",
  sidebarWidth: "260px",
  headerHeight: "70px",
  transition: "all 0.3s ease",
};

export const SidebarWrapper = styled.div<{ $active?: boolean }>`
  grid-row: 1 / 3;
  background: linear-gradient(180deg, ${theme.dark} 0%, #16213e 100%);
  color: white;
  overflow-y: auto;
  transition: ${theme.transition};
  box-shadow: ${theme.shadow};
  z-index: 1000;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 1px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }

  @media (max-width: 992px) {
    transform: translateX(-100%);
    position: fixed;
    height: 100vh;
    z-index: 1001;

    ${({ $active }) =>
      $active &&
      `
      transform: translateX(0);
      box-shadow: ${theme.shadowLg};
    `}
  }
`;

export const Logo = styled.div`
  padding: 24px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 10px;

  h1 {
    font-size: 26px;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.5px;
    margin: 0;
  }

  span {
    color: ${theme.primaryLight};
    background: linear-gradient(45deg, ${theme.primaryLight}, ${theme.success});
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 4px;
  }
`;

export const NavMenu = styled.div`
  padding: 10px 0;
`;

export const MenuHeading = styled.div`
  padding: 16px 25px 8px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  padding: 12px 25px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: ${theme.transition};
  border-left: 4px solid transparent;
  margin: 4px 0;
  border-radius: 0 ${theme.radiusSm} ${theme.radiusSm} 0;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: ${theme.transition};
  }

  &:hover::after {
    width: 100%;
  }

  &:hover,
  ${({ $active }) => $active && `&`} {
    background-color: rgba(255, 255, 255, 0.07);
    border-left-color: ${theme.primaryLight};
  }

  ${({ $active }) =>
    $active &&
    `
    background: linear-gradient(90deg, rgba(67, 97, 238, 0.2), transparent);
    font-weight: 500;
  `}

  i {
    width: 24px;
    margin-right: 12px;
    font-size: 18px;
    text-align: center;
    transition: ${theme.transition};
  }

  &:hover i {
    transform: translateY(-2px);
  }
`;
