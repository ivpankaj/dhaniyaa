import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadToCloudinary } from '@/lib/upload';

interface UploadState {
    uploading: boolean;
    error: string | null;
    uploadedUrl: string | null;
}

const initialState: UploadState = {
    uploading: false,
    error: null,
    uploadedUrl: null,
};

export const uploadFile = createAsyncThunk(
    'upload/uploadFile',
    async (file: File, { rejectWithValue }) => {
        try {
            const url = await uploadToCloudinary(file);
            return url;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Upload failed');
        }
    }
);

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        resetUpload: (state) => {
            state.uploading = false;
            state.error = null;
            state.uploadedUrl = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.uploading = true;
                state.error = null;
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.uploading = false;
                state.uploadedUrl = action.payload;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
