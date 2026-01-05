import React, { useRef, useState } from 'react';
import styles from './AddWordForm.module.css';

interface AddWordFormProps {
  onAddWord: (
    term: string,
    definition: string,
    exampleSentence: string,
    meaningOfExampleSentence: string
  ) => Promise<void>;
}

const AddWordForm: React.FC<AddWordFormProps> = ({ onAddWord }) => {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [meaningOfExampleSentence, setMeaningOfExampleSentence] = useState('');
  
  // 제출 시도 여부 (필수 입력 강조를 위함)
  const [isSubmitted, setIsSubmitted] = useState(false);
  const termInputRef = useRef<HTMLInputElement>(null);

  // 모든 필드가 채워졌는지 확인 (토스 스타일 활성화 로직)
  const isFormValid = 
    term.trim() !== '' && 
    definition.trim() !== '' && 
    exampleSentence.trim() !== '' && 
    meaningOfExampleSentence.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true); // 제출 시도 기록

    if (!isFormValid) {
      // 흔들리는 효과나 진동 등을 추가할 수 있지만, 여기서는 알림으로 대체
      return;
    }
    
    try {
      await onAddWord(term, definition, exampleSentence, meaningOfExampleSentence);
      
      // 초기화
      setTerm('');
      setDefinition('');
      setExampleSentence('');
      setMeaningOfExampleSentence('');
      setIsSubmitted(false); // 초기화
      termInputRef.current?.focus();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label className={`${styles.label} ${isSubmitted && !term ? styles.errorLabel : ''}`}>
          단어
        </label>
        <input
          ref={termInputRef}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className={`${styles.input} ${isSubmitted && !term ? styles.errorInput : ''}`}
          placeholder="영단어를 입력하세요"
          autoFocus
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={`${styles.label} ${isSubmitted && !definition ? styles.errorLabel : ''}`}>
          의미
        </label>
        <input
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          className={`${styles.input} ${isSubmitted && !definition ? styles.errorInput : ''}`}
          placeholder="뜻을 입력하세요"
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={`${styles.label} ${isSubmitted && !exampleSentence ? styles.errorLabel : ''}`}>
          예문
        </label>
        <textarea
          value={exampleSentence}
          onChange={(e) => setExampleSentence(e.target.value)}
          className={`${styles.textarea} ${isSubmitted && !exampleSentence ? styles.errorInput : ''}`}
          placeholder="학습에 도움이 될 예문을 입력하세요"
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={`${styles.label} ${isSubmitted && !meaningOfExampleSentence ? styles.errorLabel : ''}`}>
          예문 해석
        </label>
        <textarea
          value={meaningOfExampleSentence}
          onChange={(e) => setMeaningOfExampleSentence(e.target.value)}
          className={`${styles.textarea} ${isSubmitted && !meaningOfExampleSentence ? styles.errorInput : ''}`}
          placeholder="예문의 해석을 입력하세요"
        />
      </div>

      <button 
        type="submit" 
        className={`${styles.submitButton} ${isFormValid ? styles.active : styles.disabled}`}
        disabled={!isFormValid && isSubmitted} // 입력이 안됐는데 제출 시도했을 때만 버튼 막기 (혹은 항상 비활성화)
      >
        단어 저장하기
      </button>
    </form>
  );
};

export default AddWordForm;