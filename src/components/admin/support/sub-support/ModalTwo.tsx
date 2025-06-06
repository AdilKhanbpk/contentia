import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import {
    fetchAdminClaims,
    updateAdminClaim,
} from "@/store/features/admin/claimSlice";
import { toast } from "react-toastify";
import { ClaimInterface } from "@/types/interfaces";

interface ModalTwoProps {
    claim: ClaimInterface | null;
}

export default function ModalTwo({ claim }: ModalTwoProps) {
    console.log("🚀 ~ ModalTwo ~ claim:", claim);
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Pick<ClaimInterface, "claimContent">>({
        defaultValues: { claimContent: claim?.claimContent || "" },
    });

    const onSubmit: SubmitHandler<Pick<ClaimInterface, "claimContent">> = (
        data
    ) => {
        if (claim?._id) {
            setLoading(true); // Set loading to true before the dispatch
            dispatch(
                updateAdminClaim({
                    claimId: claim._id,
                    data,
                })
            )
                .unwrap()
                .then(() => {
                    toast.success("Claim content updated successfully!");
                    setLoading(false); // Reset loading state after success
                    dispatch(fetchAdminClaims());
                })
                .catch((error) => {
                    toast.error(
                        `Failed to update claim: ${
                            error.message || "Unknown error"
                        }`
                    );
                    setLoading(false); // Reset loading state after failure
                });
        } else {
            toast.error("Missing claim ID");
        }
    };

    useEffect(() => {
        reset({ claimContent: claim?.claimContent || "" });
    }, [claim, reset]);

    if (!claim) {
        return <p>Loading...</p>;
    }

    return (
        <div className='bg-white my-4 p-4 sm:my-6 sm:p-5 md:my-8 md:p-6 lg:my-8 lg:p-6'>
            <h1 className='text-lg font-semibold'>View Claim</h1>

            {/* Display Customer Details */}
            <div className='mt-4 sm:mt-6 md:mt-8 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-6'>
                <div>
                    <label className='block text-sm font-semibold mt-2 sm:mt-3 md:mt-4 lg:mt-4'>
                        Creator Name
                    </label>
                    <p className='mt-3'>
                        {claim.creator?.fullName || "No Name "}
                    </p>
                </div>

                <div>
                    <label className='block text-sm font-semibold mt-2 sm:mt-3 md:mt-4 lg:mt-4'>
                        Creator ID
                    </label>
                    <p className='mt-3'>{claim.creator?._id || "N/A"}</p>
                </div>
            </div>

            {/* Display Order Details */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-6'>
                <div>
                    <label className='block text-sm font-semibold mt-2 sm:mt-3 md:mt-4 lg:mt-4'>
                        Order ID
                    </label>
                    <p className='mt-3'>{claim.order?._id || "N/A"}</p>
                </div>

                <div>
                    <label className='block text-sm font-semibold mt-2 sm:mt-3 md:mt-4 lg:mt-4'>
                        Claim Date
                    </label>
                    <p className='mt-3'>
                        {claim.claimDate
                            ? new Date(claim.claimDate).toLocaleDateString()
                            : "N/A"}
                    </p>
                </div>
            </div>

            {/* Claim Content Form */}
            <div className='bg-white py-4 sm:py-5 md:py-6 lg:py-6 rounded-md'>
                <h2 className='text-base font-semibold mb-1'>Claim Content</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-2 sm:mb-3 md:mb-3 lg:mb-4'>
                        <textarea
                            {...register("claimContent", {
                                required: "Claim content is required",
                            })}
                            className='w-full p-2 sm:p-3 md:p-4 lg:p-4 border border-gray-400 rounded-lg focus:outline-none'
                            rows={3}
                            placeholder='Enter claim details'
                        />
                        {errors.claimContent && (
                            <p className='text-red-500 text-sm mt-1'>
                                {errors.claimContent.message}
                            </p>
                        )}
                    </div>

                    <div className='flex justify-end'>
                        <button
                            type='submit'
                            className='Button text-white px-8 py-1 rounded-lg font-semibold'
                            disabled={loading} // Disable button during loading
                        >
                            {loading ? "Updating..." : "Update Claim"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
