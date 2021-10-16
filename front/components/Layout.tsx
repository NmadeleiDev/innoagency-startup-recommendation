import styled from 'styled-components';
import { Header, Sidebar } from 'components';

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
    grid-template-columns: 200px 3fr;
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
      <div className="footer">Footer</div>
    </StyledDiv>
  );
};

export default Layout;
