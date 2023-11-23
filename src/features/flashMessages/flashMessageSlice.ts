import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define an interface for the state
interface FlashMessageState {
    message: string | null;
    type: string | null;
    timestamp: number | null;
}

// Define an interface for the payload of setFlashMessage action
interface SetFlashMessagePayload {
    message: string;
    type: string;
}

// Initial state with types
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