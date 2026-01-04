import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { createWord } from '../../api/client';
import AddWordForm from '../../components/AddWordForm/AddWordForm';
import HomeButton from '../../components/HomeButton/HomeButton';
import styles from './AddWordPage.module.css';

const AddWordPage: React.FC = () => {
  const { selectedProfile } = useProfile();
  const navigate = useNavigate();

  // 프로필이 없으면 초기 화면으로 리디렉션
  React.useEffect(() => {
    if (!selectedProfile) {
      navigate('/');
    }
  }, [selectedProfile, navigate]);

  const handleAddWord = async (
    term: string, 
    definition: string, 
    exampleSentence: string, 
    meaningOfExampleSentence: string
  ) => {
    if (!selectedProfile) return;

    try {
      await createWord(selectedProfile.id, {
        term: term.trim(),
        definition: definition.trim(),
        exampleSentence: exampleSentence.trim(),
        meaningOfExampleSentence: meaningOfExampleSentence.trim(),
        level: 0,
      });
      
      // 추가 완료 후 단어 목록 페이지로 이동
      alert('단어가 추가되었습니다.');
      navigate('/words');
    } catch (error) {
      console.error(error);
      alert('단어 추가 중 오류가 발생했습니다.');
    }
  };

  if (!selectedProfile) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Add New Word</h2>
      </header>

      <div className={styles.navigation}>
        <HomeButton />
        <button 
          className={styles.backButton} 
          onClick={() => navigate('/words')}
        >
          목록으로 돌아가기
        </button>
      </div>

      <div className={styles.formContainer}>
        <AddWordForm onAddWord={handleAddWord} />
      </div>
    </div>
  );
};

export default AddWordPage;