import React from 'react';
import { Word } from '../../types/Word';
import styles from './ShowWords.module.css';
import ActionEditButton from '../ActionButtons/ActionEditButton';
import ActionDelButton from '../ActionButtons/ActionDelButton';

interface ShowWordsProps {
  words: Word[];
  editingId: number | null;
  editingTerm: string;
  editingDefinition: string;
  onDelete: (id: number) => void;
  onDeleteStart: (id: number) => void;
  deletingId: number | null;
  onEditStart: (word: Word) => void;
  onEditTermChange: (value: string) => void;
  onEditDefinitionChange: (value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDeleteCancel: () => void;
  onViewExample: (word: Word) => void; // 새로 추가된 prop
}

const ShowWords: React.FC<ShowWordsProps> = ({
  words,
  editingId,
  editingTerm,
  editingDefinition,
  onDelete,
  onDeleteStart,
  deletingId,
  onEditStart,
  onEditTermChange,
  onEditDefinitionChange,
  onEditSave,
  onEditCancel,
  onDeleteCancel,
  onViewExample
}) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEditSave();
    }
  };

  let sequence = 1;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.sequenceCol}></th>
          <th className={styles.termCol}>단어</th>
          <th className={styles.definitionCol}>의미</th>
          <th className={styles.levelCol}>레벨</th>
          <th className={styles.actionCol}>수정</th>
          <th className={styles.actionCol}>삭제</th>
          <th className={styles.actionCol}>예문</th> {/* 새 컬럼 */}
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {words.map((word) => {
          const isEditing = editingId === word.id;
          const isDeleting = deletingId === word.id;

          return (
            <tr key={word.id}>
              {/* Sequence Column */}
              <td className={styles.sequenceCol} data-label="No.">
                {sequence++}
              </td>
              {/* Term Column */}
              <td className={styles.termCol} data-label="단어">
                {isEditing ? (
                  <input
                    value={editingTerm}
                    onChange={(e) => onEditTermChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                    autoFocus
                    aria-label="Edit term"
                  />
                ) : (
                  word.term
                )}
              </td>

              {/* Definition Column */}
              <td className={styles.definitionCol} data-label="의미">
                {isEditing ? (
                  <input
                    value={editingDefinition}
                    onChange={(e) => onEditDefinitionChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                    aria-label="Edit definition"
                  />
                ) : (
                  word.definition
                )}
              </td>

              <td className={styles.levelCol} data-label="레벨">
                <strong>{word.level}</strong>
              </td>

              {/* Edit/Save Column */}
              <td className={styles.actionCol} data-label="수정">
                <ActionEditButton
                  isEditing={isEditing}
                  onEditStart={() => onEditStart(word)}
                  onEditSave={onEditSave}
                  isDeleting={isDeleting}
                  onDeleteCancel={onDeleteCancel}
                />
              </td>

              {/* Delete/Cancel Column */}
              <td className={styles.actionCol} data-label="삭제">
                <ActionDelButton
                  isEditing={isEditing}
                  onDelete={() => onDelete(word.id)}
                  onDeleteStart={() => onDeleteStart(word.id)}
                  isDeleting={isDeleting}
                  onEditCancel={onEditCancel}
                />
              </td>

              {/* View Example Column */}
              <td className={styles.actionCol} data-label="예문보기">
                <button
                  onClick={() => onViewExample(word)}
                  className={styles.viewExampleButton}
                  aria-label={`View example for ${word.term}`}
                >
                  <img src='./example.svg' alt='view' className={styles.viewSVG}/>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ShowWords;