import React from 'react';
import styles from './Progress.module.scss'

interface ProgressProps {
    fullScreen?: boolean;
}

const Progress: React.FC<ProgressProps> = ({ fullScreen }) => {
    return (
        <div className={`${styles.progress} ${fullScreen && styles.fullScreen}`}>
            <div className={`${styles.spinner} iconfont icon-loading`}></div>
        </div>
    );
};

export default Progress;