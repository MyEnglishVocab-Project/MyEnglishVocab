import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import MainPage from './pages/MainPage/MainPage';
import ProfileSelectionPage from './pages/ProfileSelectionPage/ProfileSelectionPage';
import CreateProfilePage from './pages/CreateProfilePage/CreateProfilePage';
import WordListPage from './pages/WordListPage/WordListPage';
import QuizPage from './pages/QuizPage/QuizPage';
import AddWordPage from './pages/AddWordPage/AddWordPage';

export const API_URL = 'http://localhost:3001/words';

const App: React.FC = () => {
  return (
    <ProfileProvider>
      <Router>
        <Routes>
          {/* 초기 화면: 프로필 선택 또는 생성 */}
          <Route path="/" element={<ProfileSelectionPage />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />

          {/* 프로필 선택 후 메인 페이지로 이동 */}
          <Route path="/main" element={<MainPage />} />
          <Route path="/words" element={<WordListPage />} />
          <Route path="/add-word" element={<AddWordPage />} />
          <Route path="/quiz" element={<QuizPage />} />

          {/* 잘못된 경로는 초기 화면으로 리디렉션 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
};

export default App;
