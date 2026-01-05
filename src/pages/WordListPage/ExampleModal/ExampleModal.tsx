import React, { useState } from 'react';
import { Word } from '../../../types/Word';
import styles from './ExampleModal.module.css';

interface ExampleModalProps {
  word: Word;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<Word>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const ExampleModal: React.FC<ExampleModalProps> = ({ word, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTerm, setEditTerm] = useState(word.term);
  const [editDef, setEditDef] = useState(word.definition);
  const [editExample, setEditExample] = useState(word.exampleSentence || '');
  const [editMeaning, setEditMeaning] = useState(word.meaningOfExampleSentence || '');

  const handleSave = () => {
    onUpdate(word.id, { 
      term: editTerm, 
      definition: editDef,
      exampleSentence: editExample,
      meaningOfExampleSentence: editMeaning,
      level: word.level
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {isEditing ? (
            <div className={styles.inputWrapper}>
              <input 
                className={styles.editInput} 
                value={editTerm} 
                onChange={(e) => setEditTerm(e.target.value)}
                placeholder="단어"
                autoFocus
              />
            </div>
          ) : (
            <h2 className={styles.termTitle}>{word.term}</h2>
          )}
        </div>

        <div className={styles.infoSection}>
          <label className={styles.label}>의미</label>
          {isEditing ? (
            <div className={styles.inputWrapper}>
              <input 
                className={styles.editInput} 
                value={editDef} 
                onChange={(e) => setEditDef(e.target.value)}
                placeholder="의미"
              />
            </div>
          ) : (
            <p className={styles.text}>{word.definition}</p>
          )}
        </div>

        <div className={styles.infoSection}>
          <label className={styles.label}>예문</label>
          {isEditing ? (
            <div className={styles.inputWrapper}>
              <textarea 
                className={styles.editTextarea} 
                value={editExample} 
                onChange={(e) => setEditExample(e.target.value)}
                placeholder="학습에 도움이 될 예문"
              />
            </div>
          ) : (
            <p className={styles.text}>{word.exampleSentence || '등록된 예문이 없습니다.'}</p>
          )}
        </div>

        <div className={styles.infoSection}>
          <label className={styles.label}>예문 해석</label>
          {isEditing ? (
            <div className={styles.inputWrapper}>
              <textarea 
                className={styles.editTextarea} 
                value={editMeaning} 
                onChange={(e) => setEditMeaning(e.target.value)}
                placeholder="예문의 해석"
              />
            </div>
          ) : (
            <p className={styles.text}>{word.meaningOfExampleSentence || '해석이 없습니다.'}</p>
          )}
        </div>

        <div className={styles.buttonGroup}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className={styles.saveButton}>저장</button>
              <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>취소</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className={styles.editButton}>수정</button>
              <button onClick={() => onDelete(word.id)} className={styles.deleteButton}>삭제</button>
            </>
          )}
        </div>
        
        <button onClick={onClose} className={styles.closeButton}>닫기</button>
      </div>
    </div>
  );
};

export default ExampleModal;