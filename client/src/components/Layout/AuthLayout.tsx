import React, { ReactNode } from 'react';
import logo from './Logo.png';
import preview from './Preview.png';
import styles from './AuthLayout.module.scss';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <div className={styles.form}>
                <div className={styles.formContent}>
                    <header className={styles.header}>
                        <img className={styles.logo} src={logo} alt="Logo" />
                    </header>
                    <main className={styles.main}>
                        {children}
                    </main>
                </div>
            </div>
            <div className={styles.preview}>
                <div className={styles.previewImageWrap}>
                    <img className={styles.previewImage} src={preview} alt="Preview" />
                </div>
            </div>
        </div>
    );
};

export default Layout;
