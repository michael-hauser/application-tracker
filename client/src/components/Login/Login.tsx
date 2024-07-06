import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../state/store';
import { loginUser, selectUserStatus } from '../../state/slices/userSlice';
import styles from './Login.module.scss';

const Login: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectUserStatus);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/');
    } else {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Log In</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
