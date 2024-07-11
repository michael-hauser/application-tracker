import React, { ReactNode, useEffect } from 'react';
import styles from './Sidebar.module.scss';

interface SidebarProps {
    children: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    useEffect(() => {
        // Add the 'modal-open' class to the body when the component mounts to prevent background scrolling
        document.body.classList.add('modal-open');

        // Remove the 'modal-open' class from the body when the component unmounts
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, []);

    return (
        <div className={styles.overlay}>
            <div className={styles.sidebar}>
                {children}
            </div>
        </div>
    );
};

export default Sidebar;
