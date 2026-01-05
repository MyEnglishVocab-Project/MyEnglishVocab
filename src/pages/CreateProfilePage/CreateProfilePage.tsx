import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { createProfile } from '../../api/client';
import styles from './CreateProfilePage.module.css';

const CreateProfilePage: React.FC = () => {
  const [profileName, setProfileName] = useState('');
  const navigate = useNavigate();
  const { addProfile } = useProfile();

  // 입력값이 있는지 확인하여 버튼 활성화 상태 결정
  const isFormValid = profileName.trim().length > 0;

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

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
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <h2 className={styles.title}>프로필 생성</h2>
      </header>

      <main className={styles.main}>
        {/* 질문 섹션 */}
        <section className={styles.welcomeSection}>
          <h1 className={styles.greeting}>어떤 이름으로<br />시작할까요?</h1>
          <p className={styles.subGreeting}>나중에 언제든 바꿀 수 있어요.</p>
        </section>

        {/* 입력 카드 */}
        <div className={styles.formCard}>
          <form onSubmit={handleCreateProfile} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="profileName" className={styles.label}>프로필 이름</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="profileName"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className={styles.input}
                  required
                  autoFocus
                  placeholder="이름을 입력해주세요"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`${styles.submitButton} ${isFormValid ? styles.active : styles.disabled}`}
              disabled={!isFormValid}
            >
              확인
            </button>
          </form>
        </div>

        {/* 돌아가기 버튼 */}
        <div onClick={() => navigate('/')} className={styles.backButton}>
          이전으로 돌아가기
        </div>
      </main>
    </div>
  );
};

export default CreateProfilePage;