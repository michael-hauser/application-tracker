import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { fetchUserDetails, selectUser, selectUserStatus } from './state/slices/userSlice';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import { getCsrfToken, isAuthenticated } from './utils/auth';
import { AppDispatch } from './state/store';
import Layout from './components/Layout/Layout';
import styles from './App.module.scss';
import AuthLayout from './components/Layout/AuthLayout';
import Progress from './lib/progress/Progress';
import PageNotFound from './components/PageNotFound/PageNotFound';
import UserAgreement from './components/UserAgreement/UserAgreement';
import ResetPassword from './components/ResetPassword/ResetPassword';
import UpdatePassword from './components/ResetPassword/UpdatePassword/UpdatePassword';

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(selectUser);
  const userStatus = useSelector(selectUserStatus);
  
  useEffect(() => {
    getCsrfToken();
    if (isAuthenticated()) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch]);

  if (userStatus === 'loading') {
    return <Progress fullScreen={true} />;
  }

  return (
    <div className={styles.app}>
      <Router>
        <Routes>
            <Route path="/login" element={!user ? <AuthLayout><Login /></AuthLayout> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <AuthLayout><Register /></AuthLayout> : <Navigate to="/" />} />
            <Route path="/reset-password" element={!user ? <AuthLayout><ResetPassword /></AuthLayout> : <Navigate to="/" />} />
            <Route path="/update-password" element={!user ? <AuthLayout><UpdatePassword /></AuthLayout> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Layout><Home /></Layout> : <Navigate to="/login" />} />
            <Route path="/license" element={user ? <Layout><UserAgreement /></Layout> : <Navigate to="/login" />} />
            <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
