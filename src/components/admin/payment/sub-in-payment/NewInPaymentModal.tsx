import { createPayment } from "@/store/features/admin/incomingPaymentSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface CreateInvoiceModalProps {
    onClose: () => void;
}

export default function CreatePayment({ onClose }: CreateInvoiceModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector(
        (state: RootState) => state.incomingPayment
    );
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append("orderId", data.orderId);
        formData.append("invoiceImage", data.invoiceImage[0]);

        try {
            await dispatch(createPayment({ formData }));
            onClose();
        } catch (error) {
            console.log("🚀 ~ onSubmit ~ error:", error);
        }
    };

    return (
        <div className='flex justify-center bg-gray-100'>
            <div className='bg-white p-6 rounded-lg w-96 shadow-md'>
                <h2 className='text-xl font-semibold mb-4'>Create Invoice</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-2'>
                        <label className='block text-sm font-medium'>
                            Order ID
                        </label>
                        <input
                            type='text'
                            {...register("orderId", { required: true })}
                            className='w-full p-2 border rounded'
                        />
                        {errors.orderId && (
                            <p className='text-red-500 text-xs'>
                                Order ID is required
                            </p>
                        )}
                    </div>

                    <div className='mb-2'>
                        <label className='block text-sm font-medium'>
                            Invoice Image
                        </label>
                        <input
                            {...register("invoiceImage", { required: true })}
                            type='file'
                            accept='image/*'
                            className='w-full p-2 border rounded'
                        />
                        {errors.invoiceImage && (
                            <p className='text-red-500 text-xs'>
                                Invoice Image is required
                            </p>
                        )}
                    </div>

                    <div className='flex justify-end space-x-2 mt-4'>
                        <button
                            type='submit'
                            className='px-4 py-2 bg-blue-500 text-white rounded'
                        >
                            {isSubmitting ? "Creating..." : "Create Invoice"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
