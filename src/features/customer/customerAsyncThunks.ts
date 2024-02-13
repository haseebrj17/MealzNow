import { createAsyncThunk } from '@reduxjs/toolkit';
import Realm from 'realm';
import { realmConfig } from '../../db/Db';
import { RootState } from '../../Store';

export const submitSubscriptionThunk = createAsyncThunk(
    'customer/submitSubscription',
    async (_, { getState }) => {
        const state = getState() as RootState;
        const customerData = state.customer.customer;

        const realm = await Realm.open(realmConfig);

        try {
            realm.write(() => {
                let customerToUpdate = realm.objectForPrimaryKey('Customer', customerData?._id);

                if (customerToUpdate) {
                    Object.assign(customerToUpdate, customerData);
                } else {
                    realm.create('Customer', {
                        _id: customerData?._id || new Realm.BSON.ObjectId(),
                        type: customerData?.type || 'customer',
                        ...customerData,
                    });
                }
            });
        } catch (error) {
            console.error("Failed to save customer data to Realm:", error);
            throw error;
        }
    }
);
