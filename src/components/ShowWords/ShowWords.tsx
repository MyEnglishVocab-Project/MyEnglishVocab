import React from 'react';
import { Word } from '../../types/Word';
import styles from './ShowWords.module.css';

interface ShowWordsProps {
  words: Word[];
  onWordClick: (word: Word) => void;
}

const ShowWords: React.FC<ShowWordsProps> = ({ words, onWordClick }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.sequenceColHeader}>No.</th>
          <th className={styles.termColHeader}>단어</th>
          <th className={styles.definitionColHeader}>의미</th>
          <th className={styles.levelColHeader}>레벨</th>
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {words.map((word, index) => (
          <tr key={word.id} onClick={() => onWordClick(word)} className={styles.row}>
            <td className={styles.sequenceCol}>{index + 1}</td>
            <td className={styles.termCol}>{word.term}</td>
            <td className={styles.definitionCol}>{word.definition}</td>
            <td className={styles.levelCol}><strong>{word.level}</strong></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShowWords;