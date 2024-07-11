import React, { ReactNode } from 'react';
import styles from './StatsWidget.module.scss';

type StatsWidgetProps = {
    children: ReactNode;
    title: string;
};

const StatsWidget: React.FC<StatsWidgetProps> = ({ children, title}) => {
    return (
        <div className={styles.widget}>
            <div className={styles.title}>{title}</div>
            <div className={styles.content}>{children}</div>
        </div>
    );
};

export default StatsWidget;