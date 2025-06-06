"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

interface PlanFormData {
    title: string;
    description: string;
    price: number;
    platform: string;
    edit: string;
    duration: string;
    aspectRatio: string;
    share: string;
    coverPicture: string;
    creatorType: string;
    shipping: string;
    customerName: string;
    numberOfUGC: number;
    assignCreators: string;
}

export default function NewPackageModal() {
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [isEdit, setIsEdit] = useState("");
    const [aspectRatio, setAspectRatio] = useState("");
    const [isShare, setIsShare] = useState("");
    const [isCoverPicture, setIsCoverPicture] = useState("");
    const [creatorType, setCreatorType] = useState("");
    const [isShipping, setIsShipping] = useState("");
    const [duration, setDuration] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, control, watch } = useForm<PlanFormData>();

    const onSubmitForm: SubmitHandler<PlanFormData> = (data) => {
        setIsSubmitting(true);
    };

    const numberOfUGC = watch("numberOfUGC");
    const price = watch("price");
    const totalPrice = (numberOfUGC || 0) * (price || 0);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className='bg-white my-4 p-4 sm:my-6 sm:p-5 md:my-8 md:p-6 lg:my-8 lg:p-6'>
                    <h2 className='text-lg mb-6 font-semibold'>
                        Create Custom Package
                    </h2>
                    <div className='flex flex-col lg:flex-row justify-start items-start lg:space-x-28'>
                        {/* Left Side Fields */}
                        <div className='mt-2 grid grid-cols-1 lg:grid-cols-1 space-y-3'>
                            {/* Select Customer */}
                            <div>
                                <label className='block text-sm font-semibold mt-2'>
                                    Select Customer:
                                </label>
                                <input
                                    type='text'
                                    placeholder='Enter customer name'
                                    className='w-full px-3 py-1 border rounded-md focus:outline-none'
                                    {...register("customerName")}
                                />
                            </div>

                            {/* Package Type */}
                            <div>
                                <label className='block text-sm font-semibold mt-2'>
                                    Package Type
                                </label>
                                <input
                                    type='text'
                                    placeholder='Package Type'
                                    className='w-full px-3 py-1 border rounded-md focus:outline-none'
                                    {...register("numberOfUGC")}
                                />
                            </div>

                            {/* Select Price */}
                            <div>
                                <label className='block text-sm font-semibold mt-2'>
                                    Select Price:
                                </label>
                                <input
                                    type='number'
                                    placeholder='Enter price'
                                    className='w-full px-3 py-1 border rounded-md focus:outline-none'
                                    {...register("price")}
                                />
                            </div>

                            {/* Total Price Display */}
                            <div className='mt-4'>
                                <span className='block text-sm font-semibold'>
                                    Total Price:
                                </span>
                                <span className='text-lg BlueText font-semibold'>
                                    {totalPrice.toLocaleString("tr-TR")} TL
                                </span>
                            </div>
                        </div>

                        <div className='mt-4 lg:mt-0 bg-white rounded-md mb-4 sm:mb-6 md:mb-8 lg:mb-8'>
                            <h3 className=' font-semibold mb-4 BlueText'>
                                Select Additional Services
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4'>
                                {/* Platform Radio Buttons */}
                                <div className='text-gray-700 font-semibold'>
                                    Platform:
                                </div>
                                <div className='flex space-x-4'>
                                    <Controller
                                        name='platform'
                                        control={control}
                                        defaultValue='TikTok'
                                        render={({ field }) => (
                                            <>
                                                {[
                                                    {
                                                        label: "Instagram",
                                                        value: "instagram",
                                                    },
                                                    {
                                                        label: "TikTok",
                                                        value: "tiktok",
                                                    },
                                                    {
                                                        label: "Facebook",
                                                        value: "facebook",
                                                    },
                                                    {
                                                        label: "Youtube",
                                                        value: "youtube",
                                                    },
                                                    {
                                                        label: "X",
                                                        value: "x",
                                                    },
                                                    {
                                                        label: "Linkedin",
                                                        value: "linkedin",
                                                    },
                                                ].map((platform) => (
                                                    <button
                                                        key={platform.value}
                                                        type='button'
                                                        className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                            selectedPlatform ===
                                                            platform.value
                                                                ? "Button text-white"
                                                                : "bg-gray-200"
                                                        }`}
                                                        onClick={() => {
                                                            setSelectedPlatform(
                                                                platform.value
                                                            );
                                                            field.onChange(
                                                                platform.value
                                                            );
                                                        }}
                                                    >
                                                        {platform.label}
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Duration Radio Buttons */}
                                <div className='text-gray-700 font-semibold'>
                                    Süre:
                                </div>
                                <div className='flex space-x-4'>
                                    <Controller
                                        name='duration'
                                        control={control}
                                        defaultValue='15s'
                                        render={({ field }) => (
                                            <>
                                                {["15s", "30s", "60s"].map(
                                                    (dur) => (
                                                        <button
                                                            key={dur}
                                                            type='button'
                                                            className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                                duration === dur
                                                                    ? "Button text-white"
                                                                    : "bg-gray-200"
                                                            }`}
                                                            onClick={() => {
                                                                setDuration(
                                                                    dur
                                                                );
                                                                field.onChange(
                                                                    dur
                                                                );
                                                            }}
                                                        >
                                                            {dur}
                                                        </button>
                                                    )
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Edit Option */}
                                <div className='text-gray-700 font-semibold'>
                                    Edit:
                                </div>
                                <div className='flex space-x-4'>
                                    <Controller
                                        name='edit'
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                {["Yes", "No"].map((option) => (
                                                    <button
                                                        key={option}
                                                        type='button'
                                                        className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                            isEdit === option
                                                                ? "Button text-white"
                                                                : "bg-gray-200"
                                                        }`}
                                                        onClick={() => {
                                                            setIsEdit(option);
                                                            field.onChange(
                                                                option
                                                            );
                                                        }}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Aspect Ratio */}
                                <div className='text-gray-700 font-semibold'>
                                    En Boy Oranı :
                                </div>
                                <div className='flex space-x-4'>
                                    <Controller
                                        name='aspectRatio'
                                        control={control}
                                        defaultValue='9:16'
                                        render={({ field }) => (
                                            <>
                                                {["9:16", "16:9"].map(
                                                    (ratio) => (
                                                        <button
                                                            key={ratio}
                                                            type='button'
                                                            className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                                aspectRatio ===
                                                                ratio
                                                                    ? "Button text-white"
                                                                    : "bg-gray-200"
                                                            }`}
                                                            onClick={() => {
                                                                setAspectRatio(
                                                                    ratio
                                                                );
                                                                field.onChange(
                                                                    ratio
                                                                );
                                                            }}
                                                        >
                                                            {ratio}
                                                        </button>
                                                    )
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Share Option */}
                                <div className='text-gray-700 font-semibold'>
                                    Share:
                                </div>
                                <div className='flex space-x-4'>
                                    <Controller
                                        name='share'
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                {["Yes", "No"].map((option) => (
                                                    <button
                                                        key={option}
                                                        type='button'
                                                        className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                            isShare === option
                                                                ? "Button text-white"
                                                                : "bg-gray-200"
                                                        }`}
                                                        onClick={() => {
                                                            setIsShare(option);
                                                            field.onChange(
                                                                option
                                                            );
                                                        }}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Cover Picture Option */}
                                <div className='text-gray-700 font-semibold'>
                                    Cover Picture:
                                </div>
                                <div className='flex space-x-4'>
                                    <Controller
                                        name='coverPicture'
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                {["Yes", "No"].map((option) => (
                                                    <button
                                                        key={option}
                                                        type='button'
                                                        className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                            isCoverPicture ==
                                                            option
                                                                ? "Button text-white"
                                                                : "bg-gray-200"
                                                        }`}
                                                        onClick={() => {
                                                            setIsCoverPicture(
                                                                option
                                                            );
                                                            field.onChange(
                                                                option
                                                            );
                                                        }}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Creator Type */}
                                <div className='text-gray-700 font-semibold'>
                                    Creator Type:
                                </div>
                                <div className='flex space-x-4'>
                                    <Controller
                                        name='creatorType'
                                        control={control}
                                        defaultValue='Nano'
                                        render={({ field }) => (
                                            <>
                                                {["Nano", "Micro"].map(
                                                    (type) => (
                                                        <button
                                                            key={type}
                                                            type='button'
                                                            className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                                creatorType ===
                                                                type
                                                                    ? "Button text-white"
                                                                    : "bg-gray-200"
                                                            }`}
                                                            onClick={() => {
                                                                setCreatorType(
                                                                    type
                                                                );
                                                                field.onChange(
                                                                    type
                                                                );
                                                            }}
                                                        >
                                                            {type}
                                                        </button>
                                                    )
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Shipping Option */}
                                <div className='text-gray-700 font-semibold'>
                                    Shipping:
                                </div>
                                <div className='flex space-x-4'>
                                    <Controller
                                        name='shipping'
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                {["Yes", "No"].map((option) => (
                                                    <button
                                                        key={option}
                                                        type='button'
                                                        className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                            isShipping ===
                                                            option
                                                                ? "Button text-white"
                                                                : "bg-gray-200"
                                                        }`}
                                                        onClick={() => {
                                                            setIsShipping(
                                                                option
                                                            );
                                                            field.onChange(
                                                                option
                                                            );
                                                        }}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Save Button */}
                    <div className='mt-6 text-right'>
                        <button
                            type='submit'
                            className='Button text-white px-6 py-0.5 rounded'
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}
