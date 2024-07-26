import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import logo from './Logo.png';
import styles from './Layout.module.scss';
import UserMenu from './UserMenu/UserMenu';
import InfoBanner from '../InfoBanner/InfoBanner';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <InfoBanner />
      <header className={styles.header}>
        <Link to="/">
          <img className={styles.logo} src={logo} alt="Logo" />
        </Link>
        <UserMenu />
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
