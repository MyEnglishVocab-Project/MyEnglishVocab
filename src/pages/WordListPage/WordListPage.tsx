import React, { useEffect, useState } from 'react';
import { Word } from '../../types/Word';
import styles from './WordListPage.module.css';
import HomeButton from '../../components/HomeButton/HomeButton';
import AddWordForm from '../../components/AddWordForm/AddWordForm';
import ShowWords from '../../components/ShowWords/ShowWords';
import ExampleModal from './ExampleModal/ExampleModal';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { getWords, createWord, deleteWord, updateWord } from '../../api/client';

const WordListPage: React.FC = () => {
  const { selectedProfile } = useProfile();
  const [words, setWords] = useState<Word[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTerm, setEditingTerm] = useState('');
  const [editingDefinition, setEditingDefinition] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSortedAsc, setIsSortedAsc] = useState<boolean>(true);
  const [modalWord, setModalWord] = useState<Word | null>(null); // 모달에 표시할 단어
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedProfile) {
      navigate('/');
      return;
    }

    // 선택된 프로필의 단어 목록을 가져오기
    getWords(selectedProfile.id)
      .then((data) => setWords(data))
      .catch((err) => console.error(err));
  }, [selectedProfile, navigate]);

  const handleAddWord = async (term: string, definition: string, exampleSentence: string, meaningOfExampleSentence: string) => {
    if (!selectedProfile) return;

    try {
      const createdWord = await createWord(selectedProfile.id, {
        term: term.trim(),
        definition: definition.trim(),
        exampleSentence: exampleSentence.trim(),
        meaningOfExampleSentence: meaningOfExampleSentence.trim(),
        level: 0,
      });
      setWords((prev) => [...prev, createdWord]);
    } catch (error) {
      console.error(error);
      alert('단어 추가 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteStart = (id: number) => {
    setDeletingId(id);
  };

  const handleDeleteCancel = () => {
    setDeletingId(null);
  };

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

    // 기존 단어 정보 찾기 (level 유지 등을 위해)
    const existingWord = words.find(w => w.id === editingId);
    if (!existingWord) return;

    try {
      const savedWord = await updateWord(editingId, {
        term: editingTerm.trim(),
        definition: editingDefinition.trim(),
        level: existingWord.level, // 기존 레벨 유지
        exampleSentence: existingWord.exampleSentence, // 기존 예문 유지 (폼에 입력칸이 없다면)
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

  // "예문보기" 버튼 클릭 시 모달에 해당 단어 전달
  const handleViewExample = (word: Word) => {
    setModalWord(word);
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

  if (!selectedProfile) {
    return null; // 로딩 스피너나 메시지 추가 가능
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Word List</h2>

      <HomeButton />
      <br />

      <div className={styles.addWordFormContainer}>
        <AddWordForm onAddWord={handleAddWord} />
      </div>
      
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
          onViewExample={handleViewExample}  // 전달
        />
      </div>

      {/* 모달 렌더링 */}
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