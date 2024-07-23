import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

interface Stats {
  totalOrder: number;
  pendingOrder: number;
  completed: number;
  cancelled: number;
}

const loadState = (): Stats => {
  try {
    const serializedState = localStorage.getItem('orderStats');
    if (serializedState === null) {
      return {
        totalOrder: 0,
        pendingOrder: 0,
        completed: 0,
        cancelled: 0
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      totalOrder: 0,
      pendingOrder: 0,
      completed: 0,
      cancelled: 0
    };
  }
};

const saveState = (state: Stats) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('orderStats', serializedState);
  } catch (err) {
    toast.error('something went wrong.');
  }
};

const initialState: Stats = loadState();

const orderStatsSlice = createSlice({
  name: 'Order Stats',
  initialState: initialState,
  reducers: {
    setOrderStats: (state, action: PayloadAction<Stats>) => {
      state.totalOrder = action.payload.totalOrder;
      state.completed = action.payload.completed;
      state.cancelled = action.payload.cancelled;
      state.pendingOrder = action.payload.pendingOrder;
      saveState(state);
    }
  }
});

export const { setOrderStats } = orderStatsSlice.actions;
export default orderStatsSlice.reducer;
