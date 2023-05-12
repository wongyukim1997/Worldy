// src/features/counter/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface LoginState {
  state: boolean;
  nickname: string;
  profileImg: string;
  token: string;
}

interface loginPayload {
  // nickname: string;
  profileImg: string;
}

const initialState: LoginState = {
  state: false,
  nickname: '',
  profileImg: '',
  token: '',
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<loginPayload>) => {
      state.state = true;
      // state.nickname = action.payload.nickname;
      state.profileImg = action.payload.profileImg;
      sessionStorage.setItem('isLoggedIn', 'true');
      // sessionStorage.setItem('nickname', action.payload.nickname);
      sessionStorage.setItem('profileImg', action.payload.profileImg);
      console.log('슬라이스에서의 로그인 로그인 로그인');
    },
    logout: (state) => {
      console.log('로그아웃로그아웃로그아웃로그아웃');
      state.state = false;
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('nickname');
      sessionStorage.removeItem('profileImg');
      sessionStorage.removeItem('token');
    },
    addNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
      sessionStorage.setItem('nickname', action.payload);
    },
    addToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      sessionStorage.setItem('token', action.payload);
      console.log('토큰 추가', action.payload);
    },
  },
});

export const { login, logout, addNickname, addToken } = loginSlice.actions;
export const wholeState = (state: RootState) => state.login;
export const loginState = (state: RootState) => state.login.state;
export const loginNickName = (state: RootState) => state.login.nickname;
export const loginProfileImg = (state: RootState) => state.login.profileImg;
export const loginToken = (state: RootState) => state.login.token;
export default loginSlice.reducer;