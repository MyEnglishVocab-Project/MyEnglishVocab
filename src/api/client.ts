import axios from 'axios';
import { Profile } from '../types/Profile';
import { Word } from '../types/Word';

const client = axios.create({
  baseURL: 'http://54.180.24.42:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 프로필 API ---
export const getProfiles = async () => {
  const response = await client.get<Profile[]>('/profiles');
  return response.data;
};

export const createProfile = async (name: string) => {
  const response = await client.post<Profile>('/profiles', { name });
  return response.data;
};

// 프로필 삭제
export const deleteProfile = async (profileId: number) => {
  await client.delete(`/profiles/${profileId}`);
};


// --- 단어 API ---
export const getWords = async (profileId: number) => {
  const response = await client.get<Word[]>(`/words/${profileId}`);
  return response.data;
};

export const createWord = async (profileId: number, wordData: Omit<Word, 'id' | 'profileId'>) => {
  const response = await client.post<Word>(`/words/${profileId}`, wordData);
  return response.data;
};

export const deleteWord = async (wordId: number) => {
  await client.delete(`/words/${wordId}`);
};

// 단어 수정
export const updateWord = async (wordId: number, wordData: Partial<Word>) => {
  const response = await client.put<Word>(`/words/${wordId}`, wordData);
  return response.data;
};