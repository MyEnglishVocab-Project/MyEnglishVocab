import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import styles from './MainPage.module.css';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import { Word } from '../../types/Word';
import DeleteAccountButton from '../../components/DeleteAccountButton/DeleteAccountButton';
import { getWords } from '../../api/client';

const MainPage: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const { selectedProfile } = useProfile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedProfile) {
      navigate('/');
      return;
    };

    getWords(selectedProfile.id)
      .then((data) => {
        setWords(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [selectedProfile, navigate]);

  if(!selectedProfile) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Welcome, {selectedProfile.name}!</h2>
      <h1>My English Vocabulary</h1>
      <p>단어 개수 : <strong>{words.length}</strong></p>
      <div className={styles.buttons}>
        <Link to="/words">
          <button className={styles.button}>나의 단어장</button>
        </Link>
        <Link to="/quiz">
          <button className={styles.button}>단어 테스트</button>
        </Link>
      </div>
      <div className={styles.logout}>
        <LogoutButton />
        <DeleteAccountButton />
      </div>

    </div>
  );
};

export default MainPage;