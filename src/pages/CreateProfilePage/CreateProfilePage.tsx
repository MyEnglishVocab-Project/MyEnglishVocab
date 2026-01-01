import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { createProfile } from '../../api/client'; // API 함수 임포트
import styles from './CreateProfilePage.module.css';

const CreateProfilePage: React.FC = () => {
  const [profileName, setProfileName] = useState('');
  const navigate = useNavigate();
  const { addProfile } = useProfile();

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileName.trim() === '') {
      alert('프로필 이름을 입력해주세요.');
      return;
    }

    try {
      const createdProfile = await createProfile(profileName.trim());

      addProfile(createdProfile);
      navigate('/main');
    } catch (error) {
      console.error(error);
      alert('프로필 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>새 프로필 만들기</h2>
      <form onSubmit={handleCreateProfile} className={styles.form}>
        <label htmlFor="profileName">프로필 이름</label>
        <input
          type="text"
          id="profileName"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          className={styles.input}
          required
          autoFocus
          placeholder="이름을 입력해주세요"
          aria-label="프로필 이름 입력"
        />
        <button type="submit" className={styles.submitButton}>
          만들기
        </button>
      </form>
      <button onClick={() => navigate('/')} className={styles.backButton}>
        돌아가기
      </button>
    </div>
  );
};

export default CreateProfilePage;