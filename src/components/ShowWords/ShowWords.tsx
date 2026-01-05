/* ShowWords.tsx */
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
      <tbody className={styles.tableBody}>
        {words.map((word, index) => (
          <tr key={word.id} onClick={() => onWordClick(word)} className={styles.row}>
            <td className={styles.sequenceCol}>{index + 1}</td>
            <td className={styles.contentCol}>
              <div className={styles.term}>{word.term}</div>
              <div className={styles.definition}>{word.definition}</div>
            </td>
            <td className={styles.levelCol}>
              <span className={styles.levelBadge}>Lv.{word.level}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShowWords;