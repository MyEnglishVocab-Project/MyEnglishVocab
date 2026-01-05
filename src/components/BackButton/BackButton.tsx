import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button 
      className={styles.backButton} 
      onClick={() => navigate(-1)} 
      aria-label="뒤로가기"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M15 18L9 12L15 6" 
          stroke="#191F28" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackButton;