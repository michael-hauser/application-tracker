import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch } from '../../state/store';
import { resetPassword, selectUserStatus, selectUserError } from '../../state/slices/userSlice';
import styles from './ResetPassword.module.scss';

const ResetPassword: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const status = useSelector(selectUserStatus);
    const error = useSelector(selectUserError);

    const [email, setEmail] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email) {
            setLocalError('Please provide your email address');
            return;
        }

        const resultAction = await dispatch(resetPassword(email));

        if (!resetPassword.fulfilled.match(resultAction)) {
            setLocalError('Password reset failed. Please check your email address.');
        }
    };

    return (
        <div className={styles.container}>
            <h1>Reset Password</h1>
            {localError && <p className={styles.error}>{localError}</p>}
            {error && <p className={styles.error}>{error}</p>}
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button className='primary-button' type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending reset link...' : 'Send Reset Link'}
                </button>
            </form>
            <Link to="/login">
                <button className='secondary-button' type="submit" disabled={status === 'loading'}>
                    Back to Login
                </button>
            </Link>
        </div>
    );
};

export default ResetPassword;
