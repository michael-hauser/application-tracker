import React, { useState, useRef, useEffect } from 'react';
import LogoutButton from '../logoutButton/logoutButton';
import { useSelector } from 'react-redux';
import styles from './UserMenu.module.scss';
import Avatar from '../../../lib/Avatar/Avatar';
import { Link } from 'react-router-dom';

interface UserMenuProps { }

const UserMenu: React.FC<UserMenuProps> = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to handle click outside dropdown
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className={styles.userMenu}>
      <div className={styles.button} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <span className={styles.userName}>{user.name}</span>
        <Avatar name={user.name} avatarUrl={user.avatarUrl} size='m' />
      </div>
      {dropdownOpen && (
        <div ref={dropdownRef} className={styles.dropdownMenu}>
          <div className={styles.avatarWrap}>
            <Avatar name={user.name} avatarUrl={user.avatarUrl} size="l" />
          </div>
          <span className={styles.menuUserName}>{user.name}</span>
          <Link to="/license" className={styles.dropdownItem}>User Agreement</Link>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default UserMenu;
