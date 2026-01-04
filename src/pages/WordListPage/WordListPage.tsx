import React, { useEffect, useState } from 'react';
import { Word } from '../../types/Word';
import styles from './WordListPage.module.css';
import HomeButton from '../../components/HomeButton/HomeButton';
// import AddWordForm from '../../components/AddWordForm/AddWordForm'; // 제거됨
import ShowWords from '../../components/ShowWords/ShowWords';
import ExampleModal from './ExampleModal/ExampleModal';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { getWords, deleteWord, updateWord } from '../../api/client';

const WordListPage: React.FC = () => {
  const { selectedProfile } = useProfile();
  const [words, setWords] = useState<Word[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTerm, setEditingTerm] = useState('');
  const [editingDefinition, setEditingDefinition] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSortedAsc, setIsSortedAsc] = useState<boolean>(true);
  const [modalWord, setModalWord] = useState<Word | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedProfile) {
      navigate('/');
      return;
    }

    getWords(selectedProfile.id)
      .then((data) => setWords(data))
      .catch((err) => console.error(err));
  }, [selectedProfile, navigate]);

  // handleAddWord 로직이 AddWordPage로 이동함

  const handleDeleteStart = (id: number) => setDeletingId(id);
  const handleDeleteCancel = () => setDeletingId(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteWord(id);
      setWords((prev) => prev.filter((word) => word.id !== id));
      setDeletingId(null);
    } catch (error) {
      console.error(error);
      alert('단어 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEditStart = (word: Word) => {
    setEditingId(word.id);
    setEditingTerm(word.term);
    setEditingDefinition(word.definition);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTerm('');
    setEditingDefinition('');
  };

  const handleEditSave = async () => {
    if (editingId === null || !selectedProfile) return;

    const existingWord = words.find(w => w.id === editingId);
    if (!existingWord) return;

    try {
      const savedWord = await updateWord(editingId, {
        term: editingTerm.trim(),
        definition: editingDefinition.trim(),
        level: existingWord.level,
        exampleSentence: existingWord.exampleSentence,
        meaningOfExampleSentence: existingWord.meaningOfExampleSentence
      });

      setWords((prev) => prev.map((w) => (w.id === editingId ? savedWord : w)));
      setEditingId(null);
      setEditingTerm('');
      setEditingDefinition('');
    } catch (error) {
      console.error(error);
      alert('단어 수정 중 오류가 발생했습니다.');
    }
  };

  const handleViewExample = (word: Word) => setModalWord(word);

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
      <div className={styles.header}>
        <h2 className={styles.title}>My Word List</h2>
      </div>
      
      <div className={styles.topNavigation}>
        <button 
          className={styles.addPageButton} 
          onClick={() => navigate('/add-word')}
        >
          단어 추가
        </button>
      </div>

      <div className={styles.content}>

        <div className={styles.sortButtonContainer}>
          <button onClick={handleSort} className={styles.sortButton} aria-label="Sort words">
            {isSortedAsc ? 
              <img src='./za.svg' alt='za' className={styles.zaSVG}/>
            : 
              <img src='./az.svg' alt='az' className={styles.azSVG}/> 
            }
          </button>
        </div>

        <div className={styles.tableContainer} aria-label="Word list table">
          <ShowWords
            words={words}
            editingId={editingId}
            editingTerm={editingTerm}
            editingDefinition={editingDefinition}
            onDelete={handleDelete}
            onDeleteStart={handleDeleteStart}
            deletingId={deletingId}
            onEditStart={handleEditStart}
            onEditTermChange={setEditingTerm}
            onEditDefinitionChange={setEditingDefinition}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onDeleteCancel={handleDeleteCancel}
            onViewExample={handleViewExample}
          />
        </div>

      </div>

      <HomeButton />

      {modalWord && (
        <ExampleModal
          word={modalWord}
          onClose={() => setModalWord(null)}
        />
      )}
    </div>
  );
};

export default WordListPage;