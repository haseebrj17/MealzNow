export interface FlashMessageState {
    message: string | null;
    type: string | null;
    timestamp: number | null;
}

export interface SetFlashMessagePayload {
    message: string;
    type: string;
}