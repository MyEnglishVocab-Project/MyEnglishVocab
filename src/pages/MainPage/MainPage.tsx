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
      navigate('/', { replace: true }); // replace를 사용하여 히스토리를 깔끔하게 관리
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

  useEffect(() => {
    // bfcache(뒤로가기 캐시) 대응 로직
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // 캐시로부터 복원되었다면 위치를 새로고침하거나 상태를 재확인
        window.location.reload(); 
        // 만약 전체 새로고침이 싫다면, 최소한 로그아웃 버튼의 렌더링을 트리거해야 합니다.
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    
    if (!selectedProfile) {
      navigate('/', { replace: true });
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

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
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
      {/* 상단 헤더 섹션 */}
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

        {/* 메인 메뉴 버튼 섹션 */}
        <div className={styles.menuSection}>
          <Link to="/words" className={styles.menuLink}>
            <button className={styles.myWordsButton}>
              <div className={styles.buttonContent}>
                <span className={styles.buttonTitle}>나의 단어장</span>
                <span className={styles.buttonDesc}>저장한 단어 확인하기</span>
              </div>
              {/* 토스 스타일 셰브론 아이콘 */}
              <div className={styles.arrow}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </Link>

          <Link to="/quiz" className={styles.menuLink}>
            <button className={styles.quizButton}>
              <div className={styles.buttonContent}>
                <span className={styles.buttonTitle}>단어 테스트</span>
                <span className={styles.buttonDesc}>실력 뽐내기</span>
              </div>
              {/* 토스 스타일 셰브론 아이콘 */}
              <div className={styles.arrow}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MainPage;