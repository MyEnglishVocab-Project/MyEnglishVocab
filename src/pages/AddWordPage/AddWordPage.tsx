import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { createWord } from '../../api/client';
import AddWordForm from '../../components/AddWordForm/AddWordForm';
import styles from './AddWordPage.module.css';

const AddWordPage: React.FC = () => {
  const { selectedProfile } = useProfile();
  const navigate = useNavigate();

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
      
      alert('단어가 추가되었습니다.');
      navigate('/words', { replace: true });
    } catch (error) {
      console.error(error);
      alert('단어 추가 중 오류가 발생했습니다.');
    }
  };

  if (!selectedProfile) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>단어 추가</h2>
      </header>

      <main className={styles.main}>
        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <AddWordForm onAddWord={handleAddWord} />
          </div>
          
          <div 
            className={styles.backButton} 
            onClick={() => navigate(-1)}
          >
            단어장 목록으로 돌아가기
          </div>
        </section>
      </main>
    </div>
  );
};

export default AddWordPage;