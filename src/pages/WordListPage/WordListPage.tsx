import React, { useEffect, useState, useRef } from 'react';
import { Word } from '../../types/Word';
import styles from './WordListPage.module.css';
import HomeButton from '../../components/HomeButton/HomeButton';
import ShowWords from '../../components/ShowWords/ShowWords';
import ExampleModal from './ExampleModal/ExampleModal';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { getWords, deleteWord, updateWord } from '../../api/client';
import BackButton from '../../components/BackButton/BackButton';

const WordListPage: React.FC = () => {
  const { selectedProfile } = useProfile();
  const [words, setWords] = useState<Word[]>([]);
  const [isSortedAsc, setIsSortedAsc] = useState<boolean>(true);
  const [modalWord, setModalWord] = useState<Word | null>(null);
  const [showTopButton, setShowTopButton] = useState(false);
  
  const scrollRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedProfile) {
      navigate('/');
      return;
    }
    fetchWords();
  }, [selectedProfile, navigate]);

  // 스크롤 감지 및 상단 버튼 노출 제어
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (scrollContainer.scrollTop > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchWords = async () => {
    try {
      const data = await getWords(selectedProfile!.id);
      setWords(data);
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (id: number, updatedData: Partial<Word>) => {
    try {
      const savedWord = await updateWord(id, updatedData);
      setWords((prev) => prev.map((w) => (w.id === id ? savedWord : w)));
      setModalWord(null);
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteWord(id);
      setWords((prev) => prev.filter((word) => word.id !== id));
      setModalWord(null);
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSort = () => {
    const sortedWords = [...words].sort((a, b) => {
      const termA = a.term.toLowerCase();
      const termB = b.term.toLowerCase();
      if(termA < termB) return isSortedAsc ? -1 : 1;
      if(termA > termB) return isSortedAsc ? 1 : -1;
      return 0;
    });
    setWords(sortedWords);
    setIsSortedAsc(!isSortedAsc);
  };

  if (!selectedProfile) return null;

  return (
    <div className={styles.container}>
      {/* 헤더 클릭 시 최상단 이동 UX */}
      <header className={styles.header} onClick={scrollToTop}>
        <div className={styles.headerLeft}>
          <BackButton />
        </div>
        <h2 className={styles.title}>나의 단어장</h2>
        <div className={styles.headerRight} />
      </header>

      <main className={styles.main} ref={scrollRef}>
        <div className={styles.topNavigation}>
          <button className={styles.addPageButton} onClick={() => navigate('/add-word')}>
            단어 추가
          </button>
          <button onClick={handleSort} className={styles.sortButton}>
            <img 
              src={isSortedAsc ? './za.svg' : './az.svg'} 
              alt='sort' 
              className={styles.sortIcon}
            />
          </button>
        </div>

        <div className={styles.listCard}>
          <ShowWords words={words} onWordClick={(word) => setModalWord(word)} />
        </div>

        {/* Floating 상단 이동 버튼 */}
        <button 
          className={`${styles.scrollTopButton} ${showTopButton ? styles.visible : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            scrollToTop();
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      </main>

      {modalWord && (
        <ExampleModal
          word={modalWord}
          onClose={() => setModalWord(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default WordListPage;