"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAboutImage } from "@/store/features/admin/aboutSlice";
import { toast } from "react-toastify";

interface ImageUploaderProps {
    aboutId: string;
    currentImage?: string | null;
}

export default function ImageUploader({
    aboutId,
    currentImage,
}: ImageUploaderProps) {
    const dispatch = useDispatch();
    const [previewImage, setPreviewImage] = useState<string | null>(
        currentImage || null
    );
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (currentImage) {
            setPreviewImage(currentImage);
        }
    }, [currentImage]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            console.log("No file selected.");
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            toast.error("No image selected. Please choose an image to upload.");
            return;
        }

        toast.info("Uploading image... Please wait.");

        try {
            const result = await dispatch(
                updateAboutImage({
                    aboutId,
                    imageFile,
                }) as any
            );

            if (updateAboutImage.fulfilled.match(result)) {
                toast.success("Image uploaded successfully!");
                // Clear the file input after successful upload
                setImageFile(null);
            } else if (updateAboutImage.rejected.match(result)) {
                console.error("Upload error:", result.payload);
                const errorMessage = typeof result.payload === 'object' && result.payload !== null
                    ? (result.payload as any).message || "Unknown error"
                    : typeof result.payload === 'string'
                        ? result.payload
                        : "Error uploading the image. Please try again.";
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error("Error uploading the image. Please try again.");
        }
    };

    return (
        <div className='mt-4 w-full md:w-1/2'>
            <label className='block text-sm font-semibold'>Picture - 1</label>
            <div
                className='relative border border-gray-400 rounded-md p-4 text-center bg-gray-200'
                style={{ width: "100%", maxWidth: "500px", height: "300px" }}
            >
                <input
                    type='file'
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                    accept='image/*'
                    onChange={handleImageChange}
                />
                {previewImage ? (
                    <img
                        src={previewImage}
                        alt='Preview'
                        className='w-full h-full object-cover rounded-md'
                    />
                ) : (
                    <div className='flex flex-col justify-center items-center h-full pointer-events-none'>
                        <span className='text-gray-500 font-medium text-lg'>
                            2000 x 500
                        </span>
                    </div>
                )}
            </div>
            {imageFile && (
                <button
                    type='button'
                    onClick={handleImageUpload}
                    className='Button text-white px-4 py-1 rounded-lg font-semibold mt-2'
                >
                    Upload Image
                </button>
            )}
        </div>
    );
}
