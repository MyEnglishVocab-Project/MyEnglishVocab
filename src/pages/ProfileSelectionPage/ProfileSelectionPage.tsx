import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import styles from './ProfileSelectionPage.module.css';

const ProfileSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { profiles, setSelectedProfile } = useProfile();

  const handleProfileSelect = (profileId: number) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
      navigate('/main');
    }
  };

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <h2 className={styles.title}>프로필 선택</h2>
      </header>

      <main className={styles.main}>
        {/* 안내 문구 */}
        <section className={styles.welcomeSection}>
          <h1 className={styles.greeting}>누가 공부할까요?</h1>
          <p className={styles.subGreeting}>학습할 프로필을 선택해 주세요.</p>
        </section>

        {/* 프로필 리스트 */}
        <div className={styles.profileGrid}>
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <button
                key={profile.id}
                className={styles.profileCard}
                onClick={() => handleProfileSelect(profile.id)}
              >
                <div className={styles.avatar}>
                  {profile.name.charAt(0)}
                </div>
                <span className={styles.profileName}>{profile.name}</span>
              </button>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>아직 프로필이 없어요.</p>
            </div>
          )}
        </div>

        {/* 하단 액션 버튼 */}
        <button
          className={styles.createButton}
          onClick={() => navigate('/create-profile')}
        >
          새 프로필 만들기
        </button>
      </main>
    </div>
  );
};

export default ProfileSelectionPage;