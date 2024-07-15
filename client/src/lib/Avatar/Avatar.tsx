import React from 'react';
import styles from './Avatar.module.scss';

interface AvatarProps {
    name: string;
    avatarUrl?: string;
    size?: 's' | 'm' | 'l';
}

const getInitials = (name: string) => {
    const initials = name.split(' ').map((n) => n[0]).join('');
    return initials;
};

const getColor = (name: string) => {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i);
    }
    const hue = sum % 360;
    return `hsl(${hue}, 56%, 80%)`;
};

const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl, size }) => {

    const sizeClass = size ? styles[size] : styles.m;

    return (
        <div className={`${styles.avatarWrapper} ${sizeClass}`}>
            {avatarUrl ? (
                <img src={avatarUrl} alt="User Avatar" className={styles.avatar} />
            ) : (
                <div className={styles.initials} style={{ backgroundColor: getColor(name) }}>
                    {getInitials(name)}
                </div>
            )}
        </div>
    );
};

export default Avatar;
