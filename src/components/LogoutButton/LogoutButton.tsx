import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import styles from './LogoutButton.module.css';

const LogoutButton: React.FC = () => {
  const { logout } = useProfile();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('로그아웃 하시겠습니까?')) return;
    
    logout();
    navigate('/');
  };

  return (
    <button 
      onClick={handleLogout} 
      className={styles.logoutButton} 
      aria-label="로그아웃"
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;