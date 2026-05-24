import styled, { keyframes } from "styled-components";

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

export const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

export const fadeInUp = keyframes`
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

export const Container = styled.div`
  display: grid;
  grid-template-columns: ${theme.sidebarWidth} 1fr;
  grid-template-rows: ${theme.headerHeight} 1fr;
  min-height: 100vh;

  @media (max-width: 992px) {
    grid-template-columns: 0 1fr;
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

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.light};
  border-radius: 50px;
  padding: 8px 18px;
  flex: 0 0 420px;
  transition: ${theme.transition};
  border: 1px solid transparent;

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
    border-color: rgba(67, 97, 238, 0.3);
  }

  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    padding: 6px 10px;
    color: ${theme.text};
    font-size: 14px;
  }

  i {
    color: ${theme.textLight};
    font-size: 16px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 576px) {
    margin-left: auto;
  }
`;

export const Notification = styled.div`
  position: relative;
  margin: 0 15px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: ${theme.transition};

  &:hover {
    background-color: rgba(67, 97, 238, 0.1);
  }

  i {
    font-size: 18px;
    color: ${theme.textLight};
    transition: ${theme.transition};
  }

  &:hover i {
    color: ${theme.primary};
    transform: translateY(-2px);
  }

  @media (max-width: 576px) {
    margin: 0 8px;
  }
`;

export const Badge = styled.div`
  position: absolute;
  top: 3px;
  right: 3px;
  background-color: ${theme.danger};
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 6px rgba(247, 37, 133, 0.2);
  border: 2px solid white;
  font-weight: 600;
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: ${theme.radius};
  transition: ${theme.transition};
  margin-left: 10px;

  &:hover {
    background-color: rgba(67, 97, 238, 0.05);
  }
`;

export const ProfileImg = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.secondary}, ${theme.primary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 12px;
  box-shadow: 0 3px 8px rgba(67, 97, 238, 0.2);
  font-size: 16px;

  @media (max-width: 576px) {
    margin-right: 0;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 576px) {
    display: none;
  }
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

export const UserRole = styled.div`
  font-size: 12px;
  color: ${theme.textLight};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MainContent = styled.div`
  grid-column: 2;
  padding: 25px 30px;
  overflow-y: auto;

  @media (max-width: 992px) {
    padding: 20px;
  }
`;

export const PageTitle = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${fadeIn} 0.5s ease;
`;

export const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.dark};
  position: relative;
  padding-bottom: 10px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, ${theme.primary}, ${theme.primaryLight});
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;

  .btn {
    margin-left: 12px;
  }

  @media (max-width: 576px) {
    flex-direction: column;

    .btn {
      margin: 5px 0;
    }
  }
`;

export const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
  animation: ${fadeInUp} 0.6s ease;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div<{ $variant?: number }>`
  background-color: white;
  border-radius: ${theme.radius};
  padding: 28px;
  box-shadow: ${theme.shadowSm};
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.03);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    opacity: 0.8;
    transition: ${theme.transition};
    background: ${({ $variant }) => {
      switch ($variant) {
        case 1:
          return `linear-gradient(to bottom, ${theme.primary}, ${theme.primaryLight})`;
        case 2:
          return `linear-gradient(to bottom, ${theme.info}, ${theme.success})`;
        case 3:
          return `linear-gradient(to bottom, ${theme.success}, #36d399)`;
        case 4:
          return `linear-gradient(to bottom, ${theme.warning}, #ffbd59)`;
        default:
          return `linear-gradient(to bottom, ${theme.primary}, ${theme.primaryLight})`;
      }
    }};
  }

  &:hover {
    transform: translateY(-7px);
    box-shadow: ${theme.shadow};

    .card-icon {
      transform: scale(1.1);
    }

    .card-value {
      color: ${theme.primary};
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
`;

export const CardIcon = styled.div<{ $color?: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  transition: ${theme.transition};
  background: ${({ $color }) => {
    switch ($color) {
      case "purple":
        return `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
      case "blue":
        return `linear-gradient(135deg, ${theme.info}, #4cc9f0)`;
      case "green":
        return `linear-gradient(135deg, ${theme.success}, #36d399)`;
      case "orange":
        return `linear-gradient(135deg, ${theme.warning}, #ffbd59)`;
      default:
        return `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
    }
  }};
`;

export const CardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 6px;
  transition: ${theme.transition};
`;

export const CardLabel = styled.div`
  color: ${theme.textLight};
  font-size: 15px;
  font-weight: 500;
`;

export const CardChange = styled.div<{ $positive?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 8px 0 0;
  font-weight: 500;
  color: ${({ $positive }) => ($positive ? theme.success : theme.danger)};

  i {
    margin-right: 6px;
    font-size: 16px;
  }
`;

export const TableCard = styled.div`
  background-color: white;
  border-radius: ${theme.radius};
  box-shadow: ${theme.shadowSm};
  overflow: hidden;
  margin-bottom: 25px;
  animation: ${fadeInUp} 0.7s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
`;

export const CardTitle = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(248, 249, 250, 0.5);

  h3 {
    font-size: 19px;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin: 0;

    i {
      margin-right: 10px;
      color: ${theme.primary};
    }
  }
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  th,
  td {
    padding: 16px 24px;
    text-align: left;

    @media (max-width: 768px) {
      padding: 15px;
    }
  }

  th {
    font-weight: 600;
    color: ${theme.text};
    background-color: #f8f9fa;
    position: sticky;
    top: 0;
    box-shadow: 0 1px 0 0 ${theme.border};

    &:first-child {
      border-top-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
    }
  }

  td {
    border-bottom: 1px solid ${theme.border};
  }

  tbody tr {
    transition: ${theme.transition};

    &:last-child td {
      border-bottom: none;
    }

    &:hover {
      background-color: rgba(67, 97, 238, 0.03);
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
    }
  }
`;

export const Status = styled.span<{ $variant?: string }>`
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  line-height: 1;
  background-color: ${({ $variant }) => {
    switch ($variant) {
      case "active":
        return "rgba(76, 201, 240, 0.15)";
      case "pending":
        return "rgba(248, 150, 30, 0.15)";
      case "cancelled":
        return "rgba(247, 37, 133, 0.15)";
      default:
        return "rgba(76, 201, 240, 0.15)";
    }
  }};
  color: ${({ $variant }) => {
    switch ($variant) {
      case "active":
        return "#0891b2";
      case "pending":
        return "#d97706";
      case "cancelled":
        return "#db2777";
      default:
        return "#0891b2";
    }
  }};
  border: 1px solid
    ${({ $variant }) => {
      switch ($variant) {
        case "active":
          return "rgba(76, 201, 240, 0.3)";
        case "pending":
          return "rgba(248, 150, 30, 0.3)";
        case "cancelled":
          return "rgba(247, 37, 133, 0.3)";
        default:
          return "rgba(76, 201, 240, 0.3)";
      }
    }};

  i {
    margin-right: 6px;
    font-size: 12px;
  }
`;

export const Button = styled.button<{ $variant?: string; $size?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $size }) => ($size === "sm" ? "7px 14px" : "10px 20px")};
  border-radius: ${({ $size }) =>
    $size === "sm" ? theme.radiusSm : theme.radius};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  outline: none;
  font-size: ${({ $size }) => ($size === "sm" ? "13px" : "14px")};
  letter-spacing: 0.3px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  background: ${({ $variant }) =>
    $variant === "outline"
      ? "transparent"
      : `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`};
  color: ${({ $variant }) =>
    $variant === "outline" ? theme.primary : "white"};
  border: ${({ $variant }) =>
    $variant === "outline" ? `2px solid ${theme.primaryLight}` : "none"};

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: -100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::after {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    ${({ $variant }) =>
      $variant === "outline"
        ? `
        background-color: ${theme.primary};
        color: white;
        border-color: ${theme.primary};
      `
        : `
        background: linear-gradient(135deg, ${theme.secondary}, ${theme.primary});
      `}
    box-shadow: 0 6px 15px rgba(58, 12, 163, 0.2);
  }

  i {
    margin-right: 8px;
    font-size: 16px;
    transition: ${theme.transition};
  }

  &:hover i {
    transform: translateX(2px);
  }
`;

export const FasIcon = styled.i`
  font-size: 18px;
`;

export const Wrapper = styled.div`
  background: rgb(214, 214, 214);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

export const StyledA = styled.a`
  text-decoration: none;
  color: black;
`;

export const LoginContainer = styled.div`
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

export const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  padding: 8px;
`;
export const LoginTitle = styled.h1`
  text-align: center;
  text-transform: uppercase;
  font-weight: bolder;
  border-bottom: 1px solid gray;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px;
  outline: none;
  border: none;
  border: 1px solid gray;
  border-radius: 5px;
`;
export const LognButton = styled.button`
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
export const ButtonSpan = styled.span`
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

export const Hr = styled.hr`
  border-top: 2px solid purple;
`;
export const Pic = styled.div`
  width: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: violet;
`;
