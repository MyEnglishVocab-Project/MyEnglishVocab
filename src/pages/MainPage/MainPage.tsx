import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import styles from './MainPage.module.css';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import { Word } from '../../types/Word';
import { getWords } from '../../api/client';

const MainPage: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const { selectedProfile } = useProfile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedProfile) {
      navigate('/');
      return;
    };

    getWords(selectedProfile.id)
      .then((data) => {
        setWords(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [selectedProfile, navigate]);

  if(!selectedProfile) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 상단 헤더: 로그아웃 버튼 배치 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>MyVocab</span>
        </div>
        <div className={styles.headerRight}>
          <LogoutButton />
        </div>
      </header>

      <main className={styles.main}>
        {/* 인사말 섹션 */}
        <section className={styles.welcomeSection}>
          <h1 className={styles.greeting}>
            반가워요, <span className={styles.userName}>{selectedProfile.name}님!</span>
          </h1>
          <p className={styles.subGreeting}>오늘도 즐겁게 단어를 외워볼까요?</p>
        </section>

        {/* 학습 현황 카드 */}
        <div className={styles.summaryCard}>
          <div className={styles.statItem}>
            <label>나의 단어</label>
            <div className={styles.statValue}>
              <span className={styles.count}>{words.length}</span>
              <span className={styles.unit}>개</span>
            </div>
          </div>
          <div className={styles.cardDivider}></div>
          <p className={styles.cardFooter}>꾸준히 하는 모습이 멋져요!</p>
        </div>

        {/* 메인 메뉴 버튼 */}
        <div className={styles.menuSection}>
          <Link to="/words" className={styles.menuLink}>
            <button className={styles.myWordsButton}>
              <div className={styles.buttonContent}>
                <span className={styles.buttonTitle}>나의 단어장</span>
                <span className={styles.buttonDesc}>저장한 단어 확인하기</span>
              </div>
              <span className={styles.arrow}>&gt;</span>
            </button>
          </Link>

          <Link to="/quiz" className={styles.menuLink}>
            <button className={styles.quizButton}>
              <div className={styles.buttonContent}>
                <span className={styles.buttonTitle}>단어 테스트</span>
                <span className={styles.buttonDesc}>실력 뽐내기</span>
              </div>
              <span className={styles.arrow}>&gt;</span>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MainPage;