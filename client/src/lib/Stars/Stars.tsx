import React, { memo } from 'react';
import Icon from '../icon/Icon';
import styles from './Stars.module.scss';

interface StarsProps {
    rank: number;
}

const Stars: React.FC<StarsProps> = ({ rank }) => {

    const getIsSelected = (index: number) => {
        return rank >= index ? styles.selected : '';
    }

    return (
        <div className={styles.stars}>
            <div className={`${styles.star} ${getIsSelected(1)}`}>
                <Icon icon="star" />
            </div>
            <div className={`${styles.star} ${getIsSelected(2)}`}>
                <Icon icon="star" />
            </div>
            <div className={`${styles.star} ${getIsSelected(3)}`}>
                <Icon icon="star" />
            </div>
            <div className={`${styles.star} ${getIsSelected(4)}`}>
                <Icon icon="star" />
            </div>
            <div className={`${styles.star} ${getIsSelected(5)}`}>
                <Icon icon="star" />
            </div>
        </div>
    );
}

export default memo(Stars);