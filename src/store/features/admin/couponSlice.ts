import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@/store/axiosInstance';
import { AxiosError } from 'axios';
import { Customer } from '@/types/interfaces';

export interface Coupon {
    _id: string;
    customer: Customer;
    code: string;
    discountTl?: string;
    discountPercentage?: number;
    expiryDate: string;
    isActive: boolean;
    usageLimit: number | null;
    usedCount: number;
    createdAt: string;
    updatedAt: string;
}


export interface CouponState {
    data: Coupon[] | null;
    selectedCoupon: Coupon | null;
    loading: boolean;
    error: string | null;
}

const initialState: CouponState = {
    data: null,
    selectedCoupon: null,
    loading: false,
    error: null,
};

// Create a new coupon
export const createCoupon = createAsyncThunk(
    'coupon/createCoupon',
    async ({ data }: { data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/admin/coupons', data);
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(
                axiosError.response?.data || 'Failed to create coupon'
            );
        }
    }
);

// Get all coupons (admin)
export const getCoupons = createAsyncThunk(
    'coupon/getCoupons',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/admin/coupons');
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(
                axiosError.response?.data || 'Failed to fetch coupons'
            );
        }
    }
);

// Get my coupons (user)
export const getMyCoupons = createAsyncThunk(
    'coupon/getMyCoupons',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/admin/coupons/my-coupons');
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(
                axiosError.response?.data || 'Failed to fetch your coupons'
            );
        }
    }
);

// Get coupon by ID
export const getCouponById = createAsyncThunk(
    'coupon/getCouponById',
    async (
        { id }: { id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.get(`/admin/coupons/${id}`);
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(
                axiosError.response?.data || 'Failed to fetch coupon'
            );
        }
    }
);

// Update coupon
export const updateCoupon = createAsyncThunk(
    'coupon/updateCoupon',
    async (
        { id, data }: { id: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.patch(`/admin/coupons/${id}`, data);
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(
                axiosError.response?.data || 'Failed to update coupon'
            );
        }
    }
);

// Delete coupon
export const deleteCoupon = createAsyncThunk(
    'coupon/deleteCoupon',
    async (
        { id }: { id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.delete(`/admin/coupons/${id}`);
            return id;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(
                axiosError.response?.data || 'Failed to delete coupon'
            );
        }
    }
);

// Validate coupon
export const validateCoupon = createAsyncThunk(
    'coupon/validateCoupon',
    async (
        { code }: { code: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.post(
                '/admin/coupons/validate',
                { code }

            );
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(
                axiosError.response?.data || 'Failed to validate coupon'
            );
        }
    }
);

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        clearCouponError: (state) => {
            state.error = null;
        },
        clearSelectedCoupon: (state) => {
            state.selectedCoupon = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create coupon
            .addCase(createCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
                state.loading = false;
                state.data = state.data ? [...state.data, action.payload] : [action.payload];
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get all coupons
            .addCase(getCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get my coupons
            .addCase(getMyCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getMyCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get coupon by ID
            .addCase(getCouponById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCouponById.fulfilled, (state, action: PayloadAction<Coupon>) => {
                state.loading = false;
                state.selectedCoupon = action.payload;
            })
            .addCase(getCouponById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update coupon
            .addCase(updateCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
                state.loading = false;
                if (state.data) {
                    state.data = state.data.map((coupon) =>
                        coupon._id === action.payload._id ? action.payload : coupon
                    );
                }
                state.selectedCoupon = action.payload;
            })
            .addCase(updateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete coupon
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCoupon.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                if (state.data) {
                    state.data = state.data.filter((coupon) => coupon._id !== action.payload);
                }
                if (state.selectedCoupon?._id === action.payload) {
                    state.selectedCoupon = null;
                }
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Validate coupon
            .addCase(validateCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(validateCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
                state.loading = false;
                state.selectedCoupon = action.payload;
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCouponError, clearSelectedCoupon } = couponSlice.actions;
export default couponSlice.reducer;