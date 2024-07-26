import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { AppDispatch } from '../../../state/store';
import { selectUserError, selectUserStatus, updatePassword } from '../../../state/slices/userSlice';
import { isPasswordValid } from '../../../utils/passwordUtils';
import styles from './UpdatePassword.module.scss';

const UpdatePassword: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();
    const status = useSelector(selectUserStatus);
    const error = useSelector(selectUserError);

    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        // Extract token from the query params and set it in state
        const queryParams = new URLSearchParams(location.search);
        const queryToken = queryParams.get('token') || '';
        if (queryToken) {
            setToken(queryToken);
        }
    }, [location.search]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLocalError('');

        if (!token || !password || !confirmPassword) {
            setLocalError('Token, new password, and confirmation are required');
            setPassword('');
            setConfirmPassword('');
            return;
        }

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            setPassword('');
            setConfirmPassword('');
            return;
        }

        if (!isPasswordValid(password)) {
            setLocalError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            setPassword('');
            setConfirmPassword('');
            return;
        }

        const resultAction = await dispatch(updatePassword({ token, password }));

        if (updatePassword.fulfilled.match(resultAction)) {
            window.location.href = '/login';
        } else {
            setLocalError('Password update failed. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            <h1>Update Password</h1>
            {localError && <p className={styles.error}>{localError}</p>}
            {error && <p className={styles.error}>{error}</p>}
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button className='primary-button' type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Updating password...' : 'Update Password'}
                </button>
            </form>
            <Link to="/login">
                <button className='secondary-button'>
                    Back to Login
                </button>
            </Link>
        </div>
    );
};

export default UpdatePassword;
