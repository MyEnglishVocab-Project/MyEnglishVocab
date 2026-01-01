import React, { useEffect, useRef, useState } from 'react';
import { Word } from '../../types/Word';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import styles from './QuizPage.module.css';
import HomeButton from '../../components/HomeButton/HomeButton';
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
        if(window.confirm(`The level of "${currentWord.term}" increases to ${currentWord.level + 1}`)){
          handleMarkAsLearned();
        }
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

      // 단어 목록 업데이트
      setWords((prev) =>
        prev.map((w) => (w.id === word.id ? savedWord : w))
      );

    } catch (error) {
      console.error(error);
      alert('단어 레벨 업데이트 중 오류가 발생했습니다.');
    }

    handleNext();
  };

  if (words.length === 0) {
    return (
      <div className={styles.container}>
        <h2>Loading Words...</h2>
        <HomeButton />
      </div>
    );
  }

  if(currentIndex >= words.length){
    return (
      <div className={styles.container}>
        <h2>테스트가 끝났습니다!</h2>
        <HomeButton />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>단어 퀴즈</h2>
      <HomeButton />
      <h4>{currentIndex + 1} / {words.length}</h4>
      <div className={styles.quizArea}>
        <p><strong>Lv:</strong> {currentWord.level}</p>
        <p><strong>단어:</strong> {currentWord.term}</p>
        <p><strong>예문:</strong> {currentWord.exampleSentence}</p>
        {showDefinition && (
          <>
            <p><strong>뜻:</strong> {currentWord.definition}</p>
            <p><strong>예문 뜻:</strong> {currentWord.meaningOfExampleSentence}</p>
            <button
              onClick={() => {
                if(window.confirm(`The level of "${currentWord.term}" increases to ${currentWord.level + 1}`)){
                  handleMarkAsLearned();
                }
              }}
              className={styles.learnedButton}
              aria-label="외웠습니다"
            >
              <img src='./correct.svg' alt='외웠습니다' className={styles.correctSVG} />
            </button>
          </>
        )}
      </div>

      <div className={styles.buttons}>
        {showDefinition ? (
          <button className={styles.nextButton} onClick={handleNext}>다음</button>
        ) : (
          <button className={styles.showDefButton} onClick={handleShowDefinition}>뜻 보기</button>
        )}
        <button className={styles.skipButton} onClick={handleNext}>넘기기</button>
      </div>
      
      <button
        onClick={() => {
          if (window.confirm('정말로 이 단어를 삭제하시겠습니까?')){
            handleDelete(currentWord.id);
          }
        }}
        className={styles.deleteButton}
        type="button"
        aria-label="Delete word"
      >
        <img src='./delete.svg' alt='Delete' className={styles.deleteSVG} />
      </button>
    </div>
  );
};

// Fisher-Yates Shuffle 알고리즘
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default QuizPage;