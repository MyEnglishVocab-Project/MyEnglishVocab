import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import styles from './LogoutButton.module.css';

const LogoutButton: React.FC = () => {
  const { logout } = useProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 사용자에게 한 번 더 확인하는 과정은 토스에서도 흔히 쓰이는 친절한 UX입니다.
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