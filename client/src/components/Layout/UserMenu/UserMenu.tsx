import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UserMenu.module.scss';
import Avatar from '../../../lib/Avatar/Avatar';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../state/store';
import { logoutUser } from '../../../state/slices/userSlice';

interface UserMenuProps { }

const UserMenu: React.FC<UserMenuProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [dropdownOpen]);

  const handleClick = (event: MouseEvent) => {
    const clickIsOutside = dropdownRef.current && !dropdownRef.current.contains(event.target as Node);
    if (clickIsOutside) {
      setDropdownOpen(false);
    }
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser()).finally(() => { 
      closeDropdown();
      navigate('/login');
    });
  };

  if(!user) return null;

  return (
    <div className={styles.userMenu}>
      <div className={styles.button} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <span className={styles.userName}>{user.name}</span>
        <Avatar name={user.name} size='m' />
      </div>
      {dropdownOpen && (
        <div ref={dropdownRef} className={styles.dropdownMenu}>
          <div className={styles.menuHeader}>
            <div className={styles.avatarWrap}>
              <Avatar name={user.name} size="l" border={true} />
            </div>
            <div className={styles.menuUserDetails}>
              <span className={styles.menuUserName}>{user.name}</span>
              <span className={styles.menuUserEmail}>{user.email}</span>
            </div>
          </div>
          <Link to="/license" className={styles.dropdownItem} onClick={closeDropdown}>User Agreement</Link>
          <div className={styles.dropdownItem} onClick={handleLogout}>Logout</div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
