import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance, patchForm, postForm } from "@/store/axiosInstance";
import { AxiosError } from "axios";

export interface PaymentInterface {
    _id: string;
    orderId: string;
    invoiceImage?: string;
    paymentAmount: number;
    paymentStatus?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaymentState {
    payments: PaymentInterface[];
    currentPayment: PaymentInterface | null;
    loading: boolean;
    error: string | null;
}

interface uploadInvoiceImagePayload {
    orderId: string;
    formData: FormData;

}
interface CreatePaymentPayload {
    formData: FormData;

}


interface UpdatePaymentPayload {
    paymentId: string;
    data: FormData;

}

interface DeletePaymentPayload {
    paymentId: string;

}
interface RefundPaymentPayload {
    paymentId: string;

}

const initialState: PaymentState = {
    payments: [],
    currentPayment: null,
    loading: false,
    error: null,
};

export const uploadInvoiceImage = createAsyncThunk(
    "payment/uploadInvoiceImage",
    async ({ orderId, formData }: uploadInvoiceImagePayload, { rejectWithValue }) => {
        try {
            formData.append("orderId", orderId);
            const response = await postForm("/admin/incomingPayment", formData);
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Failed to create payment");
        }
    }
);
export const createPayment = createAsyncThunk(
    "payment/createPayment",
    async ({ formData }: CreatePaymentPayload, { rejectWithValue }) => {
        try {
            const response = await postForm("/admin/incomingPayment", formData);
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Failed to create payment");
        }
    }
);

export const fetchPayments = createAsyncThunk(
    "payment/fetchPayments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/admin/incomingPayment");
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Failed to fetch payments");
        }
    }
);

export const updatePayment = createAsyncThunk(
    "payment/updatePayment",
    async ({ paymentId, data }: UpdatePaymentPayload, { rejectWithValue }) => {
        try {
            const response = await patchForm(`/admin/incomingPayment/${paymentId}`, data);
            return response.data.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || `Failed to update payment with ID ${paymentId}`);
        }
    }
);

export const deletePayment = createAsyncThunk(
    "payment/deletePayment",
    async ({ paymentId }: DeletePaymentPayload, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/admin/incomingPayment/${paymentId}`);
            return paymentId;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || `Failed to delete payment with ID ${paymentId}`);
        }
    }
);

export const refundPayment = createAsyncThunk(
    "payment/refundPayment",
    async ({ paymentId }: RefundPaymentPayload, { rejectWithValue }) => {
        try {
            await axiosInstance.patch(`/admin/incomingPayment/refund-payment/${paymentId}`);
            return paymentId;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || `Failed to refund payment with ID ${paymentId}`);
        }
    }
);

const paymentSlice = createSlice({
    name: "incomingPayment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPayment.fulfilled, (state, action: PayloadAction<PaymentInterface>) => {
                state.loading = false;
                state.payments.push(action.payload);
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(uploadInvoiceImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadInvoiceImage.fulfilled, (state, action: PayloadAction<PaymentInterface>) => {
                state.loading = false;
                const existingIndex = state.payments.findIndex(p => p._id === action.payload._id);
                if (existingIndex !== -1) {
                    state.payments[existingIndex] = action.payload;
                } else {
                    state.payments.push(action.payload);
                }
            })
            .addCase(uploadInvoiceImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action: PayloadAction<PaymentInterface[]>) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updatePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePayment.fulfilled, (state, action: PayloadAction<PaymentInterface>) => {
                state.loading = false;
                state.payments = state.payments.map((payment) =>
                    payment._id === action.payload._id ? action.payload : payment
                );
            })
            .addCase(updatePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deletePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePayment.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.payments = state.payments.filter((payment) => payment._id !== action.payload);
            })
            .addCase(deletePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(refundPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refundPayment.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.payments = state.payments.map((payment) =>
                    payment._id === action.payload ? { ...payment, refundStatus: "refunded" } : payment
                );
            })
            .addCase(refundPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default paymentSlice.reducer;