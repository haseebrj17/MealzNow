import { createAsyncThunk } from '@reduxjs/toolkit';
import Realm from 'realm';
import { realmConfig } from '../../db/Db';
import { RootState } from '../../Store';

export const submitSubscriptionThunk = createAsyncThunk(
    'customer/submitSubscription',
    async (_, { getState }) => {
        const state = getState() as RootState;
        const { _id, type, ...restOfCartData } = state.cart; // Destructure to separate _id and type

        const realm = await Realm.open(realmConfig);

        try {
            realm.write(() => {
                let cartToUpdate = realm.objectForPrimaryKey('Cart', _id);

                if (cartToUpdate) {
                    Object.assign(cartToUpdate, restOfCartData, { type: type || 'Cart' });
                } else {
                    realm.create('Cart', {
                        _id: _id || new Realm.BSON.ObjectId(), // Ensures _id is set or generates a new one
                        type: type || 'Cart', // Ensures type is set or defaults to 'Cart'
                        ...restOfCartData, // Spread the rest of cartData excluding _id and type
                    });
                }
            });
        } catch (error) {
            console.error("Failed to save cart data to Realm:", error);
            throw error;
        }
    }
);
