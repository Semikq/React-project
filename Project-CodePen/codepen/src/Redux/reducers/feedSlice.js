import { createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
  name: 'feed',
  initialState: [],
  reducers: {
    addBatch: (state, action) => {
      const newData = action.payload;
      const updatedState = [...state, ...newData];
      return [...new Map(updatedState.map(item => [item._id, item])).values()].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },
    clearFeed: () => []
  },
});

export const { addBatch, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;