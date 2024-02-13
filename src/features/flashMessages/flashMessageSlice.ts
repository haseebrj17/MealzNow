import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlashMessageState, SetFlashMessagePayload } from '../../types/flashMessage';

const initialState: FlashMessageState = {
    message: null,
    type: null,
    timestamp: null
};

export const flashMessageSlice = createSlice({
    name: 'flashMessage',
    initialState,
    reducers: {
        setFlashMessage: (state, action: PayloadAction<SetFlashMessagePayload>) => {
            state.message = action.payload.message;
            state.type = action.payload.type;
            state.timestamp = new Date().getTime();
        },
        clearFlashMessage: state => {
            state.message = null;
            state.type = null;
            state.timestamp = null;
        }
    }
});

export const { setFlashMessage, clearFlashMessage } = flashMessageSlice.actions;

export default flashMessageSlice.reducer;