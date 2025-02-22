import { atom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
interface User {
  name: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}
// 初始数据
const initialUser: User = {
  name: 'John Doe',
  preferences: {
    theme: 'light',
    notifications: true,
  },
};

export const todoCountAtom = atom(0);
export const userImmerAtom = atomWithImmer<User>(initialUser);
