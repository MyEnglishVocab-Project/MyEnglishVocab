import React, { useEffect, useRef, useState } from 'react';
import { Word } from '../../types/Word';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import styles from './QuizPage.module.css';
import BackButton from '../../components/BackButton/BackButton'; // 수정됨
import { deleteWord, getWords, updateWord } from '../../api/client';

const QuizPage: React.FC = () => {
  const { selectedProfile } = useProfile();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const navigate = useNavigate();
  const isWordsLoaded = useRef(false);

  useEffect(() => {
    if (!selectedProfile) {
      navigate('/');
      return;
    }

    if (!isWordsLoaded.current){
      getWords(selectedProfile.id)
        .then((data) => {
          const shuffled = shuffleArray(data);
          setWords(shuffled);
          isWordsLoaded.current = true;
        })
        .catch((err) => console.error(err));
    }
    return () => {
      isWordsLoaded.current = false;
    };
  }, [selectedProfile, navigate]);

  const currentWord = words[currentIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        if(showDefinition){
          handleNext();
        }else{
          handleShowDefinition();
        }
      }
      if(event.key === 'Enter' && showDefinition && currentWord){
        handleMarkAsLearned();
      }
      if(event.key === 'Enter' && !showDefinition){
        handleShowDefinition();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, words, showDefinition, currentWord]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말로 이 단어를 삭제하시겠습니까?')) return;
    setShowDefinition(false);
    try{
      await deleteWord(id);
      setWords(prev => prev.filter(word => word.id !== id));
    } catch (error){
      console.error(error);
      alert('단어 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleShowDefinition = () => {
    setShowDefinition(true);
  };

  const handleNext = () => {
    setShowDefinition(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleMarkAsLearned = async () => {
    if (currentIndex >= words.length) return;
    const word = words[currentIndex];

    try {
      const updatedWordData = { ...word, level: word.level + 1 };
      const savedWord = await updateWord(word.id, updatedWordData);
      setWords((prev) => prev.map((w) => (w.id === word.id ? savedWord : w)));
    } catch (error) {
      console.error(error);
      alert('단어 레벨 업데이트 중 오류가 발생했습니다.');
    }
    handleNext();
  };

  if (words.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>단어를 불러오고 있어요</p>
        <BackButton />
      </div>
    );
  }

  if (currentIndex >= words.length) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}><BackButton /></div>
          <h2 className={styles.title}>테스트 결과</h2>
          <div className={styles.headerRight} />
        </header>

        <main className={styles.resultMain}>
          <div className={styles.resultContent}>
            <div className={styles.resultIconWrapper}>
              <span className={styles.confettiIcon}>🎉</span>
            </div>
            <h1 className={styles.resultTitle}>정말 멋져요!</h1>
            <p className={styles.resultDescription}>
              오늘 <span className={styles.highlight}>{words.length}개</span>의 단어를 확인하며<br />
              실력을 한 단계 더 쌓았어요.
            </p>
          </div>

          <footer className={styles.resultFooter}>
            <div className={styles.resultButtonGroup}>
              <button 
                className={styles.resultConfirmButton} 
                onClick={() => navigate('/main')}
              >
                확인
              </button>
              <button 
                className={styles.resultTextButton} 
                onClick={() => navigate('/words')}
              >
                단어장 목록 보기
              </button>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <BackButton /> {/* 변경됨 */}
        </div>
        <h2 className={styles.title}>단어 테스트</h2>
        <div className={styles.headerRight}>
            <button className={styles.deleteIconButton} onClick={() => handleDelete(currentWord.id)}>
                <img src='./delete.svg' alt='Delete' />
            </button>
        </div>
      </header>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
      </div>

      <main className={styles.main}>
        <div className={styles.quizInfo}>
            <span className={styles.counter}>{currentIndex + 1} / {words.length}</span>
            <span className={styles.levelBadge}>Lv.{currentWord.level}</span>
        </div>

        <div className={styles.quizCard}>
          <div className={styles.cardContent}>
            <h1 className={styles.term}>{currentWord.term}</h1>
            <div className={styles.exampleSection}>
                <label>예문</label>
                <p>{currentWord.exampleSentence}</p>
            </div>

            {showDefinition && (
              <div className={styles.definitionSection}>
                <div className={styles.divider}></div>
                <div className={styles.infoRow}>
                    <label>뜻</label>
                    <p className={styles.definitionText}>{currentWord.definition}</p>
                </div>
                <div className={styles.infoRow}>
                    <label>예문 해석</label>
                    <p className={styles.exampleMeaning}>{currentWord.meaningOfExampleSentence}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        {showDefinition ? (
          <div className={styles.buttonGroup}>
            <button className={styles.secondaryButton} onClick={handleNext}>모르겠어요</button>
            <button className={styles.primaryButton} onClick={handleMarkAsLearned}>
                <img src='./correct.svg' alt='correct' className={styles.correctIcon} />
                외웠어요
            </button>
          </div>
        ) : (
          <div className={styles.buttonGroup}>
            <button className={styles.secondaryButton} onClick={handleNext}>넘기기</button>
            <button className={styles.primaryButton} onClick={handleShowDefinition}>뜻 보기</button>
          </div>
        )}
      </footer>
    </div>
  );
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default QuizPage;