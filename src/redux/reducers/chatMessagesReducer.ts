import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sendMessage } from '../actions/chatAction';
import { ChatResponse, AppChatMessage } from '../../types/chatTypes';

interface chatState {
  messages: AppChatMessage[];
  error: string | null;
  loading: boolean;
}

const initialState: chatState = {
  messages: [],
  loading: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetState: () => initialState,
    setMessages: (state, action: PayloadAction<ChatResponse>) => {
      state.messages.push({
        message: action.payload.message! || action.payload.data!,
        sender: 'user'
      });
    },
    setBotMessage: (state, action: PayloadAction<ChatResponse>) => {
      state.messages.push({
        message: action.payload.message! || action.payload.data!,
        sender: 'bot'
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<ChatResponse>) => {
        console.log(action.payload);
        state.messages.push({
          message: action.payload.message! || action.payload.data!,
          sender: 'bot'
        });
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
        state.error = 'An error occurred';
      });
  }
});

export const { resetState, setMessages, setBotMessage } = chatSlice.actions;
export default chatSlice.reducer;
