import { Header } from "../../components/Header";
import { Sidebar } from "../../components/sidebar";
import { SidebarWrapper } from "../../components/sidebar/constants";
import { Container } from "../../constants/styles";
import { ModalProvider } from "../../providers/ModalProvider";
import { Content } from "./content";

export const Dashboard = () => {
  return (
    <Container>
      <SidebarWrapper>
        <ModalProvider>
          <Sidebar />
        </ModalProvider>
      </SidebarWrapper>
      <Header />
      <Content />
    </Container>
  );
};
