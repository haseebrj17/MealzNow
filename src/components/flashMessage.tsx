import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar } from 'react-native-paper';
import { RootState } from '../Store';
import { clearFlashMessage } from '../features/flashMessages/flashMessageSlice';

interface FlashMessageState {
    message: string | null;
    type: string | null;
}

const FlashMessage: React.FC = () => {
    const dispatch = useDispatch();
    const flashMessage = useSelector((state: RootState) => state.flashMessages) as FlashMessageState;
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        if (flashMessage.message) {
            setVisible(true); // Open the snackbar when there is a message
            const timer = setTimeout(() => {
                setVisible(false);
                dispatch(clearFlashMessage());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage, dispatch]);

    const handleClose = () => {
        setVisible(false);
        dispatch(clearFlashMessage());
    };

    if (!flashMessage.message) {
        return null;
    }

    return (
        <Snackbar
            visible={visible}
            onDismiss={handleClose}
            duration={5000}
            style={{
                backgroundColor: flashMessage.type === "error" ? "#f44336" : "#4caf50",
            }}
        >{flashMessage?.message}</Snackbar>
    );
};

export default FlashMessage;
