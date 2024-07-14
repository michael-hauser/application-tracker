import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../state/store';
import { logoutUser } from '../../../state/slices/userSlice';

const LogoutButton: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()).finally(() => { 
      navigate('/login');
    });
  };

  return (
    <button className='primary-button' onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
