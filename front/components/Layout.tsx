import styled from 'styled-components';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Footer from './Footer';

const StyledDiv = styled.div`
  .header {
    grid-area: header;
  }
  .sidebar {
    grid-area: sidebar;
  }
  .main {
    grid-area: main;
    background-color: ${({ theme }) => theme.colors.base.lightBG};
    padding: 0 2rem;
  }
  .footer {
    grid-area: footer;
  }

  display: grid;
  grid-template-areas:
    'header'
    'sidebar'
    'main'
    'footer';

  @media (min-width: 700px) {
    grid-template-columns: 80px 220px 3fr;
    grid-template-areas:
      'header header  header'
      'sidebar main main'
      'footer footer footer';
  }

  @media (min-width: 1000px) {
    grid-template-columns: 300px 3fr;
    grid-template-areas:
      'header  header'
      'sidebar main'
      'footer footer';
  }
`;

const Layout: React.FC = ({ children }) => {
  return (
    <StyledDiv>
      <Header className="header" />
      <Sidebar className="sidebar" />
      <main className="main">{children}</main>
      <Footer />
    </StyledDiv>
  );
};

export default Layout;
