import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { Profile } from '../types/Profile';
import { getProfiles, deleteProfile as apiDeleteProfile } from '../api/client';

interface ProfileContextProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  setSelectedProfile: (profile: Profile) => void;
  addProfile: (profile: Profile) => void;
  logout: () => void;
  deleteProfile: (ProfileId: number) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // 백엔드에서 프로필 목록을 가져오기
    getProfiles()
      .then((data: Profile[]) => setProfiles(data))
      .catch((error) => console.error('프로필 목록 불러오기 실패', error));
  }, []);

  const addProfile = (profile: Profile) => {
    setProfiles((prev) => [...prev, profile]);
  };

  const logout = () => {
    setSelectedProfile(null);
  };

  const deleteProfile = async (profileId: number) => {
    try {
      await apiDeleteProfile(profileId);

      setProfiles((prev) => prev.filter((profile) => profile.id !== profileId));

      if(selectedProfile && selectedProfile.id === profileId){
        logout();
      }
    } catch (error) {
      console.error(error);
      alert('프로필 삭제 중 오류가 발생했습니다.');
    }
  }

  return (
    <ProfileContext.Provider value={{ profiles, selectedProfile, setSelectedProfile, addProfile, logout, deleteProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// 커스텀 훅 생성
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};