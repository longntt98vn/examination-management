import { Header } from "../../components/Header";
import { Sidebar } from "../../components/sidebar";
import { SidebarWrapper } from "../../components/sidebar/constants";
import { Container } from "../../constants/styles";
import { ModalProvider } from "../../providers/ModalProvider";
import { Content } from "./Content";
import { NotificationProvider } from "../../providers/NotificationProvider";

export const Dashboard = () => {
  return (
    <Container>
      <SidebarWrapper>
        <NotificationProvider>
          <ModalProvider>
            <Sidebar />
          </ModalProvider>
        </NotificationProvider>
      </SidebarWrapper>
      <Header />
      <Content />
    </Container>
  );
};
