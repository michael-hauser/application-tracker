import { createAsyncThunk, SerializedError } from '@reduxjs/toolkit';

type AsyncThunkConfig = {
  serializeError?: (error: any) => SerializedError;
};

/**
 * Custom Async Trunk adds proper serialization to 
 * access the error messages from the API
 */
const createCustomAsyncThunk = <Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: (arg: ThunkArg, thunkAPI: any) => Promise<Returned>,
  config?: AsyncThunkConfig
) =>
  createAsyncThunk(typePrefix, payloadCreator, {
    serializeError: (error: any): SerializedError => {
      return {
        message: error.response?.data?.error || error.message,
      };
    },
    ...config,
  });

export default createCustomAsyncThunk;
