import Navbar from './Navbar';
import SpaceBackground from './SpaceBackground';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <SpaceBackground />
      <Navbar />
      <div className="layout-content">
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

