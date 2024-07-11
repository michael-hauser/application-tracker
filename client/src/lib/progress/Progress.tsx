import React from 'react';
import styles from './Progress.module.scss'

const Progress: React.FC = () => {
    return (
        <div className={styles.progress}>
            <div className={`${styles.spinner} iconfont icon-loading`}></div>
        </div>
    );
};

export default Progress;