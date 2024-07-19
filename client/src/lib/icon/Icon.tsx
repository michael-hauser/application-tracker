import React, { memo } from 'react';
import styles from './Icon.module.scss'

interface IconProps {
    icon: string;
}

const Icon: React.FC<IconProps> = ({ icon }) => {
    return (
        <div className={styles.iconWrap}>
            <div className={`${styles.icon} iconfont icon-${icon}`}></div>
        </div>
    );
};

export default memo(Icon);