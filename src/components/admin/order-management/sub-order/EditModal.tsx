import ModelBrand from "@/components/orders/sub-orders/ModelBrand";
import { useFileContext } from "@/context/FileContext";
import { fetchMyBrands } from "@/store/features/profile/brandSlice";
import { AppDispatch, RootState } from "@/store/store";
import { CreatorInterface, OrderInterface } from "@/types/interfaces";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import CustomModelAdmin from "@/components/modal/CustomModelAdmin";

interface EditModalProps {
    order: OrderInterface | null;
}

export default function EditModal({ order }: EditModalProps) {
    console.log("order", order);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<OrderInterface>({
        defaultValues: {
            additionalServices: {
                platform: "TikTok",
                duration: "15s",
                edit: false,
                aspectRatio: "9:16",
                share: false,
                coverPicture: false,
                creatorType: false,
                productShipping: false,
            },
        },
    });
    const dispatch = useDispatch<AppDispatch>();
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(65);
    const [showTooltipOne, setShowTooltipOne] = useState(false);
    const [showTooltipTwo, setShowTooltipTwo] = useState(false);
    const [showTooltipThree, setShowTooltipThree] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { selectedFiles, setSelectedFiles } = useFileContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string>("TikTok");
    const [duration, setDuration] = useState<string>("15s");
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [aspectRatio, setAspectRatio] = useState<string>("9:16");
    const [isShare, setIsShare] = useState<boolean>(false);
    const [isCoverPicture, setIsCoverPicture] = useState<boolean>(false);
    const [creatorType, setCreatorType] = useState<boolean>(false);
    const [isShipping, setIsShipping] = useState<boolean>(false);

    const brandRecords = useSelector(
        (state: RootState) => state.brand.myBrands
    );

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        setToken(storedToken);
        if (storedToken) {
            dispatch(fetchMyBrands(storedToken));
        }
    }, [dispatch]);

    const brands = brandRecords.map((record) => record.brandName);
    const contentType = watch("preferences.contentType");
    const handleDivClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleFileChange = (files: FileList | null) => {
        if (files) {
            const newFiles = Array.from(files);
            setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const submitForm = async (data: OrderInterface) => {
        console.log("data", data);
    };

    if (!order) return null;
    return (
        <>
            <div className='bg-white my-4 p-4 sm:my-6 sm:p-5 md:my-8 md:p-6 lg:my-8 lg:p-6'>
                <div className='bg-white rounded-md mb-4 sm:mb-6 md:mb-8 lg:mb-8'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-4'>
                        <div className='col-span-2'>
                            <div className='mb-2 sm:mb-3 md:mb-4 lg:mb-4'>
                                <h2 className='text-lg font-semibold mb-4'>
                                    Edit Order
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit(submitForm)}>
                    {/* BASIC ORDER SECTION */}
                    <section>
                        <div className='flex flex-col lg:flex-row justify-between'>
                            <div className='w-3/6'>
                                {/* Left Side Fields */}
                                <div className='mt-2 grid grid-cols-1 lg:grid-cols-1 space-y-3 px-24'>
                                    {/* Select Customer */}
                                    <div>
                                        <label className='block text-sm font-semibold mt-2'>
                                            Select Customer:
                                        </label>
                                        <input
                                            type='text'
                                            placeholder='Enter customer id'
                                            className='w-full px-3 py-1 border rounded-md focus:outline-none'
                                            {...register("orderOwner", {
                                                required:
                                                    "Customer id is required",
                                            })}
                                        />
                                    </div>

                                    {/* No of UGC */}
                                    <div>
                                        <label className='block text-sm font-semibold mt-2'>
                                            No of UGC:
                                        </label>
                                        <input
                                            type='number'
                                            placeholder='Enter number of UGC'
                                            className='w-full px-3 py-1 border rounded-md focus:outline-none'
                                            {...register("noOfUgc", {
                                                required:
                                                    "Number of UGC is required",
                                            })}
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
                                            {...register("totalPrice", {
                                                required: "Price is required",
                                            })}
                                        />
                                    </div>

                                    {/* Assign Creators */}
                                    <div>
                                        <label className='block text-sm font-semibold mt-2'>
                                            Assign Creators:
                                        </label>
                                        <input
                                            type='text'
                                            placeholder='Enter creator IDs'
                                            className='w-full px-3 py-1 border rounded-md focus:outline-none'
                                            {...register("assignedCreators")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='w-3/6'>
                                <div className='bg-white rounded-md mb-4 sm:mb-6 md:mb-8 lg:mb-8'>
                                    <h3 className='mt-4 lg:mt-0 font-semibold mb-4 BlueText'>
                                        Select Additional Services
                                    </h3>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4'>
                                        {/* Platform Radio Buttons */}
                                        <div className='text-gray-700 font-semibold'>
                                            Platform:
                                        </div>
                                        <div className='flex space-x-4'>
                                            <Controller
                                                name='additionalServices.platform'
                                                control={control}
                                                defaultValue='TikTok'
                                                render={({ field }) => (
                                                    <>
                                                        {[
                                                            "TikTok",
                                                            "Meta",
                                                            "Diğer",
                                                        ].map((platform) => (
                                                            <button
                                                                key={platform}
                                                                type='button'
                                                                className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                                    selectedPlatform ===
                                                                    platform
                                                                        ? "ButtonBlue text-white"
                                                                        : "bg-gray-200"
                                                                }`}
                                                                onClick={() => {
                                                                    setSelectedPlatform(
                                                                        platform
                                                                    );
                                                                    field.onChange(
                                                                        platform
                                                                    );
                                                                }}
                                                            >
                                                                {platform}
                                                            </button>
                                                        ))}
                                                    </>
                                                )}
                                            />
                                        </div>

                                        {/* Duration Radio Buttons */}
                                        <div className='text-gray-700 font-semibold'>
                                            Duration:
                                        </div>
                                        <div className='flex space-x-4'>
                                            <Controller
                                                name='additionalServices.duration'
                                                control={control}
                                                defaultValue='15s'
                                                render={({ field }) => (
                                                    <>
                                                        {[
                                                            "15s",
                                                            "30s",
                                                            "60s",
                                                        ].map((dur) => (
                                                            <button
                                                                key={dur}
                                                                type='button'
                                                                className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                                    duration ===
                                                                    dur
                                                                        ? "ButtonBlue text-white"
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
                                                        ))}
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
                                                name='additionalServices.edit'
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        {["Yes", "No"].map(
                                                            (option) => (
                                                                <button
                                                                    key={option}
                                                                    type='button'
                                                                    className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                                        (isEdit &&
                                                                            option ===
                                                                                "Yes") ||
                                                                        (!isEdit &&
                                                                            option ===
                                                                                "No")
                                                                            ? "ButtonBlue text-white"
                                                                            : "bg-gray-200"
                                                                    }`}
                                                                    onClick={() => {
                                                                        const newValue =
                                                                            option ===
                                                                            "Yes";
                                                                        setIsEdit(
                                                                            newValue
                                                                        );
                                                                        field.onChange(
                                                                            newValue
                                                                        );
                                                                    }}
                                                                >
                                                                    {option}
                                                                </button>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            />
                                        </div>

                                        {/* Aspect Ratio */}
                                        <div className='text-gray-700 font-semibold'>
                                            Aspect Ratio:
                                        </div>
                                        <div className='flex space-x-4'>
                                            <Controller
                                                name='additionalServices.aspectRatio'
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
                                                                            ? "ButtonBlue text-white"
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
                                                name='additionalServices.share'
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        {["Yes", "No"].map(
                                                            (option) => (
                                                                <button
                                                                    key={option}
                                                                    type='button'
                                                                    className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                                        (isShare &&
                                                                            option ===
                                                                                "Yes") ||
                                                                        (!isShare &&
                                                                            option ===
                                                                                "No")
                                                                            ? "ButtonBlue text-white"
                                                                            : "bg-gray-200"
                                                                    }`}
                                                                    onClick={() => {
                                                                        const newValue =
                                                                            option ===
                                                                            "Yes";
                                                                        setIsShare(
                                                                            newValue
                                                                        );
                                                                        field.onChange(
                                                                            newValue
                                                                        );
                                                                    }}
                                                                >
                                                                    {option}
                                                                </button>
                                                            )
                                                        )}
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
                                                name='additionalServices.coverPicture'
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        {["Yes", "No"].map(
                                                            (option) => (
                                                                <button
                                                                    key={option}
                                                                    type='button'
                                                                    className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                                        (isCoverPicture &&
                                                                            option ===
                                                                                "Yes") ||
                                                                        (!isCoverPicture &&
                                                                            option ===
                                                                                "No")
                                                                            ? "ButtonBlue text-white"
                                                                            : "bg-gray-200"
                                                                    }`}
                                                                    onClick={() => {
                                                                        const newValue =
                                                                            option ===
                                                                            "Yes";
                                                                        setIsCoverPicture(
                                                                            newValue
                                                                        );
                                                                        field.onChange(
                                                                            newValue
                                                                        );
                                                                    }}
                                                                >
                                                                    {option}
                                                                </button>
                                                            )
                                                        )}
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
                                                name='additionalServices.creatorType'
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        {["Nano", "Micro"].map(
                                                            (option) => (
                                                                <button
                                                                    key={option}
                                                                    type='button'
                                                                    className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                                        (creatorType &&
                                                                            option ===
                                                                                "Micro") ||
                                                                        (!creatorType &&
                                                                            option ===
                                                                                "Nano")
                                                                            ? "ButtonBlue text-white"
                                                                            : "bg-gray-200"
                                                                    }`}
                                                                    onClick={() => {
                                                                        const val =
                                                                            option ===
                                                                            "Micro";
                                                                        setCreatorType(
                                                                            val
                                                                        );
                                                                        field.onChange(
                                                                            val
                                                                        );
                                                                    }}
                                                                >
                                                                    {option}
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
                                                name='additionalServices.productShipping'
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        {["Yes", "No"].map(
                                                            (option) => (
                                                                <button
                                                                    key={option}
                                                                    type='button'
                                                                    className={`px-1 py-0.5 min-w-16 max-w-16 border text-xs rounded-sm ${
                                                                        (isShipping &&
                                                                            option ===
                                                                                "Yes") ||
                                                                        (!isShipping &&
                                                                            option ===
                                                                                "No")
                                                                            ? "ButtonBlue text-white"
                                                                            : "bg-gray-200"
                                                                    }`}
                                                                    onClick={() => {
                                                                        const newValue =
                                                                            option ===
                                                                            "Yes";
                                                                        setIsShipping(
                                                                            newValue
                                                                        );
                                                                        field.onChange(
                                                                            newValue
                                                                        );
                                                                    }}
                                                                >
                                                                    {option}
                                                                </button>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* BRIEF CONTENT SECTION */}
                    <section>
                        <div className='px-4 sm:px-6 md:px-12 lg:px-24'>
                            {/* First Row - Brand Selection and Brief */}
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                {/* Brand Selection */}
                                <div>
                                    <div className='flex flex-row items-center space-x-4 mb-4'>
                                        <label className='block text-sm font-semibold '>
                                            Marka Seçimi:
                                        </label>
                                        <button
                                            type='button'
                                            onClick={openModal}
                                            className='flex flex-row items-center space-x-2'
                                        >
                                            <div>
                                                <Image
                                                    width={16}
                                                    height={16}
                                                    src='/plusIcon.png'
                                                    alt='plus icon'
                                                />
                                            </div>
                                            <div>
                                                <p className='BlueText text-sm '>
                                                    Marka Ekle
                                                </p>
                                            </div>
                                        </button>
                                    </div>

                                    <CustomModelAdmin
                                        isOpen={isModalOpen}
                                        closeModal={closeModal}
                                        title=''
                                    >
                                        <ModelBrand />
                                    </CustomModelAdmin>

                                    <select
                                        {...register("briefContent.brandName", {
                                            required: false,
                                        })}
                                        value={selectedBrand}
                                        onChange={(e) =>
                                            setSelectedBrand(e.target.value)
                                        }
                                        className='w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:border-none bg-white text-gray-900'
                                    >
                                        <option
                                            value=''
                                            disabled
                                        >
                                            Brand Names
                                        </option>
                                        {brands.map((brand, index) => (
                                            <option
                                                key={index}
                                                value={brand}
                                            >
                                                {brand}
                                            </option>
                                        ))}
                                    </select>
                                    {/* {errors.brand && (
                                <span className='text-red-500'>
                                    Marka Seçimi zorunludur
                                </span>
                            )} */}
                                </div>

                                {/* Brief Section */}
                                <div className=''>
                                    <label className='block text-sm font-semibold'>
                                        Brief:
                                    </label>
                                    <textarea
                                        {...register("briefContent.brief", {
                                            maxLength: 1000,
                                        })}
                                        placeholder='İçeriğinizde öne çıkarmak istediğiniz özellik, yenilik, kampanya vb. detayları girin (Maksimum 1000 karakter)'
                                        className='w-full mt-4 px-3 py-2 border rounded-md focus:outline-none resize-none overflow-auto'
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Second Row - Product/Service Name and Scenario */}
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                {/* Product/Service Name */}
                                <div>
                                    <label className='block text-sm font-semibold mb-1'>
                                        Ürün / Hizmet Adı:
                                    </label>
                                    <input
                                        {...register(
                                            "briefContent.productServiceName",
                                            { required: true }
                                        )}
                                        type='text'
                                        placeholder='Ürün / Hizmet Adı'
                                        className='w-full px-3 py-2 border rounded-md focus:outline-none overflow-auto'
                                    />
                                    {/* {errors.briefContent.productServiceName && (
                                <span className='text-red-500'>
                                    Ürün adı zorunludur
                                </span>
                            )} */}
                                </div>

                                {/* Scenario */}
                                <div>
                                    <label className='block text-sm font-semibold mb-1'>
                                        Senaryo (Opsiyonel):
                                    </label>
                                    <textarea
                                        {...register("briefContent.scenario")}
                                        placeholder='Aklınızda bir video kurgusu varsa, çalışılmasını istediğiniz senaryoyu belirtin.'
                                        className='w-full px-3 py-2 border rounded-md focus:outline-none resize-none overflow-auto'
                                        rows={2}
                                    />
                                </div>
                            </div>

                            {/* Third Row - Product/Service Description and Sample Work */}
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                {/* Product/Service Description */}
                                <div>
                                    <label className='block text-sm font-semibold mb-1'>
                                        Ürün / Hizmet Açıklaması:
                                    </label>
                                    <textarea
                                        {...register(
                                            "briefContent.productServiceDesc"
                                        )}
                                        placeholder='Lütfen ürününüzü veya hizmetinizi içerik üreticileri için açıklayın'
                                        className='w-full px-3 py-2 border rounded-md focus:outline-none resize-none overflow-auto'
                                        rows={3}
                                    />
                                </div>

                                {/* Sample Work */}
                                <div>
                                    <label className='block text-sm font-semibold mb-1'>
                                        Örnek Çalışma (Opsiyonel):
                                    </label>
                                    <textarea
                                        {...register("briefContent.caseStudy")}
                                        placeholder='Beğendiğiniz örnek bir çalışmayı veya beğendiğiniz video linkini buraya ekleyin'
                                        className='w-full px-3 py-2 border rounded-md focus:outline-none resize-none overflow-auto'
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className='mt-3 mb-8'>
                                <label className='block text-sm font-semibold mb-2'>
                                    Dosya Yükle (Opsiyonel):
                                </label>
                                <p className='text-sm text-gray-500 mb-4'>
                                    İçerik üreticilerine iletmek istediğiniz
                                    marka, logo, ürün veya hizmet görseli,
                                    lütfen dosyanızı yükleyin.
                                </p>
                                <div
                                    className='sectionBG outline-2 outline-dashed outline-gray-300 rounded-sm p-4'
                                    onClick={handleDivClick}
                                >
                                    <div className='flex flex-col lg:flex-row justify-center lg:space-x-8'>
                                        <div className='w-full lg:w-1/6 flex justify-center items-center'>
                                            <div className='mb-4 lg:mb-0'>
                                                <Image
                                                    src='/uploadIcon.png'
                                                    alt='brand logo'
                                                    height={60}
                                                    width={60}
                                                />
                                            </div>
                                        </div>
                                        <div className='w-full lg:w-5/6'>
                                            <p className='text-sm text-gray-500 lg:-ml-8'>
                                                Dosyalarınızı sürükleyin ya da
                                                Yükle butonuna basarak
                                                cihazınızdan seçin.
                                            </p>
                                            <div className='flex justify-center items-center lg:-ml-32'>
                                                <button
                                                    type='button'
                                                    className='mt-4 py-1 px-16 ButtonBlue font-semibold text-white rounded-xl focus:outline-none'
                                                >
                                                    Yükle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <Controller
                                        name='briefContent.uploadFiles'
                                        control={control}
                                        render={({ field: { onChange } }) => (
                                            <input
                                                type='file'
                                                ref={fileInputRef}
                                                multiple
                                                className='hidden'
                                                onChange={(e) => {
                                                    onChange(e.target.files);
                                                    handleFileChange(
                                                        e.target.files
                                                    );
                                                }}
                                                accept='.jpg,.png,.gif,.pdf,.mp4,.mov,.wmv'
                                            />
                                        )}
                                    />
                                </div>
                                {/* Display selected file names */}
                                {selectedFiles.length > 0 && (
                                    <div className='mt-4'>
                                        <h3 className='text-sm font-semibold mb-2'>
                                            Seçilen Dosyalar:
                                        </h3>
                                        <ul className='flex flex-row list-disc list-inside text-sm text-gray-700'>
                                            {selectedFiles.map(
                                                (file, index) => (
                                                    <p
                                                        className='mr-2'
                                                        key={index}
                                                    >
                                                        {file.name}
                                                    </p>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* PREFERENCES ORDER SECTION */}
                    <section>
                        <div className='px-4 sm:px-6 md:px-12 lg:px-24'>
                            {/* Existing JSX remains exactly the same */}
                            <div className='flex flex-row'>
                                <h2 className='text-lg font-semibold mb-4'>
                                    İçerik Üreticisi Tercihleri{" "}
                                    <span className='font-medium'>
                                        (Opsiyonel)
                                    </span>
                                </h2>

                                <div className='relative mb-4 flex justify-center'>
                                    <button
                                        className='text-black text-sm px-3 py-1 rounded-full'
                                        onMouseEnter={() =>
                                            setShowTooltipOne(true)
                                        }
                                        onMouseLeave={() =>
                                            setShowTooltipOne(false)
                                        }
                                    >
                                        <Image
                                            src='/tooltipIcon.png'
                                            alt='brand logo'
                                            height={16}
                                            width={16}
                                            className='rounded-full'
                                        />
                                    </button>
                                    {showTooltipOne && (
                                        <div className='absolute left-0 top-full mb-1 w-48 bg-gray-700 text-white text-sm rounded p-2'>
                                            İçerik Üreticileri için yapmış
                                            olduğunuz tercihler, sizi doğru
                                            içerik üreticilerle eşleştirmemize
                                            yardımcı olacaktır. Tercihlerinizi,
                                            maksimum düzeyde karşılamaya
                                            çalışacağız.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <label className='block text-sm font-medium text-gray-700 mb-4'>
                                UGC'lerinizi hazırlayacak içerik üreticileri
                                için tercih ettiginiz özellikler bulunuyorsa,
                                lütfen seçimlerinizi yapın
                            </label>
                            <div className='flex flex-col lg:flex-row justify-between items-center lg:space-x-4'>
                                {/* Cinsiyet */}
                                <div className='mb-4 w-full lg:w-1/3 mt-2 grid grid-cols-3'>
                                    <label className='col-span-3 block text-sm font-semibold text-gray-700 mb-2'>
                                        Cinsiyet:{" "}
                                        <span className='font-medium'>
                                            (Opsiyonel)
                                        </span>
                                    </label>

                                    {["Kadın", "Erkek", "Karışık"].map(
                                        (gender, index) => (
                                            <label
                                                key={index}
                                                className='inline-flex items-center cursor-pointer mb-2 lg:mb-6'
                                            >
                                                <input
                                                    type='radio'
                                                    {...register(
                                                        "preferences.creatorGender"
                                                    )}
                                                    value={gender}
                                                    className='hidden peer'
                                                />
                                                <div className='w-5 h-5 p-1 border-2 BlueBorder rounded-full peer-checked:bg-[#4D4EC9] transition-all duration-300 ease-in-out'>
                                                    <div className='w-full h-full bg-white rounded-full'></div>
                                                </div>
                                                <span className='ml-1 text-sm'>
                                                    {gender}
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>

                                {/* İçerik Türü */}
                                <div className='mb-4 w-full lg:w-1/3'>
                                    <div className='flex flex-row'>
                                        <h2 className='text-lg font-semibold mb-4'>
                                            İçerik Türü:
                                        </h2>

                                        {/* Tooltip or Information section */}
                                        <div className='relative mb-4 flex justify-center'>
                                            <button
                                                className='text-black text-sm px-3 py-1 rounded-full'
                                                onMouseEnter={() =>
                                                    setShowTooltipTwo(true)
                                                }
                                                onMouseLeave={() =>
                                                    setShowTooltipTwo(false)
                                                }
                                            >
                                                <Image
                                                    src='/tooltipIcon.png'
                                                    alt='brand logo'
                                                    height={16}
                                                    width={16}
                                                    className='rounded-full'
                                                />
                                            </button>
                                            {showTooltipTwo && (
                                                <div className='absolute left-0 top-full mb-1 w-48 bg-gray-700 text-white text-sm rounded p-2'>
                                                    İçerik üreticilerine ürün
                                                    gönderimi sağlayacaksanız ya
                                                    da üreticilerin bir fiziki
                                                    lokasyona ulaşması
                                                    gerekiyorsa, bu alanda
                                                    içerik türünüzü belirterek
                                                    lokasyona göre eşleştirme
                                                    gerçekleştirme yapılması ge
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        UGC’lerinizde tanıtım gerektiren, içerik
                                        türünüzü seçin
                                    </label>
                                    {/* content_type */}
                                    <div className='flex justify-between space-x-4'>
                                        <label className='inline-flex items-center cursor-pointer mb-2 lg:mb-6'>
                                            <input
                                                type='radio'
                                                value='product'
                                                {...register(
                                                    "preferences.contentType"
                                                )}
                                                className='hidden peer'
                                            />
                                            <div className='w-5 h-5 p-1 border-2 BlueBorder rounded-full peer-checked:bg-[#4D4EC9] transition-all duration-300 ease-in-out'>
                                                <div className='w-full h-full bg-white rounded-full'></div>
                                            </div>
                                            <span className='ml-1 text-sm'>
                                                Ürün
                                            </span>
                                        </label>

                                        <label className='inline-flex items-center cursor-pointer mb-2 lg:mb-6'>
                                            <input
                                                type='radio'
                                                value='service'
                                                {...register(
                                                    "preferences.contentType"
                                                )}
                                                className='hidden peer'
                                            />
                                            <div className='w-5 h-5 p-1 border-2 BlueBorder rounded-full peer-checked:bg-[#4D4EC9] transition-all duration-300 ease-in-out'>
                                                <div className='w-full h-full bg-white rounded-full'></div>
                                            </div>
                                            <span className='ml-1 text-sm'>
                                                Hizmet
                                            </span>
                                        </label>

                                        <label className='inline-flex items-center cursor-pointer mb-2 lg:mb-6'>
                                            <input
                                                type='radio'
                                                value='location'
                                                {...register(
                                                    "preferences.contentType"
                                                )}
                                                className='hidden peer'
                                            />
                                            <div className='w-5 h-5 p-1 border-2 BlueBorder rounded-full peer-checked:bg-[#4D4EC9] transition-all duration-300 ease-in-out'>
                                                <div className='w-full h-full bg-white rounded-full'></div>
                                            </div>
                                            <span className='ml-1 text-sm'>
                                                Mekan
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className='my-5 flex flex-col'>
                                <div className='my-5 flex flex-col'>
                                    <label className='block text-sm font-semibold text-gray-700'>
                                        Yaş Aralığı:{" "}
                                        <span className='font-medium'>
                                            (Opsiyonel)
                                        </span>
                                    </label>

                                    <div className='w-4/12 lg:w-3/12 relative mt-2'>
                                        {/* Track background and active track */}
                                        <div className='absolute w-full h-2 bg-gray-200 rounded-full' />
                                        <div
                                            className='absolute h-2 bg-blue-600 rounded-full'
                                            style={{
                                                left: `${
                                                    ((minAge - 18) /
                                                        (65 - 18)) *
                                                    100
                                                }%`,
                                                right: `${
                                                    100 -
                                                    ((maxAge - 18) /
                                                        (65 - 18)) *
                                                        100
                                                }%`,
                                            }}
                                        />

                                        {/* Min age slider */}
                                        <input
                                            type='range'
                                            min='18'
                                            max='65'
                                            value={minAge}
                                            className='absolute w-full pointer-events-none appearance-none bg-transparent'
                                            style={{
                                                height: "2rem",
                                                margin: "-0.8rem 0",
                                                zIndex: 3,
                                            }}
                                            {...register(
                                                "preferences.maxCreatorAge"
                                            )}
                                        />

                                        {/* Max age slider */}
                                        <input
                                            type='range'
                                            min='18'
                                            max='65'
                                            value={maxAge}
                                            className='absolute w-full pointer-events-none appearance-none bg-transparent'
                                            style={{
                                                height: "2rem",
                                                margin: "-0.8rem 0",
                                                zIndex: 4,
                                            }}
                                            {...register(
                                                "preferences.minCreatorAge"
                                            )}
                                        />

                                        {/* Display age values */}
                                        <div className='flex justify-between text-sm text-gray-500 mt-4'>
                                            <span>{minAge}</span>
                                            <span>{maxAge}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* İlgi Alanları */}
                            <div className='mb-4'>
                                <label className='block text-sm font-semibold text-gray-700'>
                                    İlgi Alanları:
                                </label>
                                <div className='flex flex-col lg:flex-row justify-between lg:space-x-4'>
                                    <div className=' w-full lg:w-2/3 mt-2  grid-cols-2 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4'>
                                        {[
                                            "Spor ve Aktivite",
                                            "Sanal ve El İşleri",
                                            "Müzik",
                                            "Eğlence ve Oyun",
                                            "Yemek ve İçecek",
                                            "Bilim ve Teknoloji",
                                            "Seyahat ve Kültür",
                                            "Kitap ve Edebiyat",
                                            "Film ve Dizi",
                                            "Doğa ve Hayvanlar",
                                            "Gönüllülük",
                                            "Moda ve Güzellik",
                                            "E-Ticaret",
                                            "Üretim ve Mühendislik",
                                            "Sağlık",
                                            "Eğitim",
                                        ].map((item, index) => (
                                            <label
                                                key={index}
                                                className=' w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 inline-flex items-center cursor-pointer mb-2 lg:mb-6'
                                            >
                                                <input
                                                    type='checkbox'
                                                    {...register(
                                                        "preferences.areaOfInterest"
                                                    )}
                                                    value={item}
                                                    className='hidden peer '
                                                />
                                                <div className='w-5 h-5 p-1 border-2 BlueBorder rounded-full peer-checked:bg-[#4D4EC9]  transition-all duration-300 ease-in-out'>
                                                    <div className='w-full h-full bg-white rounded-full'></div>
                                                </div>
                                                <span className='ml-1 text-sm'>
                                                    {item}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className='w-full lg:w-1/3'>
                                        {/* If Mekan (Place) selected */}
                                        {(contentType === "product" ||
                                            contentType === "location") && (
                                            <div className='lg:-mt-28'>
                                                <div className='flex flex-row'>
                                                    <h2 className='text-lg font-semibold mb-4'>
                                                        Adres:
                                                    </h2>

                                                    {/* Tooltip or Information section */}
                                                    <div className='relative mb-4 flex justify-center'>
                                                        <button
                                                            className='text-black text-sm px-3 py-1 rounded-full'
                                                            onMouseEnter={() =>
                                                                setShowTooltipThree(
                                                                    true
                                                                )
                                                            }
                                                            onMouseLeave={() =>
                                                                setShowTooltipThree(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            <Image
                                                                src='/tooltipIcon.png'
                                                                alt='brand logo'
                                                                height={16}
                                                                width={16}
                                                                className='rounded-full'
                                                            />
                                                        </button>
                                                        {showTooltipThree && (
                                                            <div className='absolute left-0 top-full mb-1 w-48 bg-gray-700 text-white text-sm rounded p-2'>
                                                                Adres bilgileri,
                                                                tüm içerik
                                                                üreticileri
                                                                tarafından İl,
                                                                İlçe ve Mahalle
                                                                olarak
                                                                gösterilecektir.
                                                                Onaylanan içerik
                                                                üreticiler,
                                                                işletme adı ve
                                                                açık adresi
                                                                görüntüleyebilecektir.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Lütfen tanıtılmasını
                                                    istediğiniz mekanın adres
                                                    bilgilerini belirtin
                                                </label>
                                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-8'>
                                                    <div>
                                                        <label className='block text-sm font-semibold mb-2'>
                                                            Ülke
                                                        </label>
                                                        <select
                                                            className='w-full px-3 py-2 border rounded-md focus:outline-none'
                                                            {...register(
                                                                "preferences.addressDetails.country"
                                                            )}
                                                        >
                                                            <option value=''>
                                                                Seçiniz
                                                            </option>
                                                            <option value='turkiye'>
                                                                Türkiye
                                                            </option>
                                                            <option value='kktc'>
                                                                KKTC
                                                            </option>
                                                            <option value='azerbaycan'>
                                                                Azerbaycan
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-semibold mb-2'>
                                                            İl
                                                        </label>
                                                        <select
                                                            className='w-full px-3 py-2 border rounded-md focus:outline-none'
                                                            {...register(
                                                                "preferences.addressDetails.state"
                                                            )}
                                                        >
                                                            <option value=''>
                                                                Seçiniz
                                                            </option>
                                                            <option value='istanbul'>
                                                                İstanbul
                                                            </option>
                                                            <option value='ankara'>
                                                                Ankara
                                                            </option>
                                                            <option value='izmir'>
                                                                İzmir
                                                            </option>
                                                            <option value='antalya'>
                                                                Antalya
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-semibold mb-2'>
                                                            İlçe
                                                        </label>
                                                        <select
                                                            className='w-full px-3 py-2 border rounded-md focus:outline-none'
                                                            {...register(
                                                                "preferences.addressDetails.district"
                                                            )}
                                                        >
                                                            <option value=''>
                                                                Seçiniz
                                                            </option>
                                                            <option value='kadikoy'>
                                                                Kadıköy
                                                            </option>
                                                            <option value='besiktas'>
                                                                Beşiktaş
                                                            </option>
                                                            <option value='uskudar'>
                                                                Üsküdar
                                                            </option>
                                                            <option value='sisli'>
                                                                Şişli
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className='block text-sm font-semibold mb-2'>
                                                            Mahalle
                                                        </label>
                                                        <select
                                                            className='w-full px-3 py-2 border rounded-md focus:outline-none'
                                                            {...register(
                                                                "preferences.addressDetails.neighborhood"
                                                            )}
                                                        >
                                                            <option value=''>
                                                                Seçiniz
                                                            </option>
                                                            <option value='caferaga'>
                                                                Caferağa
                                                            </option>
                                                            <option value='fenerbahce'>
                                                                Fenerbahçe
                                                            </option>
                                                            <option value='rasimpasa'>
                                                                Rasimpaşa
                                                            </option>
                                                            <option value='osmanaga'>
                                                                Osmanağa
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div className='col-span-2'>
                                                        <label className='block text-sm font-semibold mb-2'>
                                                            İşletme Adı & Adres
                                                        </label>
                                                        <textarea
                                                            placeholder='Lütfen işletme adını ve açık adres bilgilerini girin.'
                                                            className='w-full text-sm px-3 py-2 border rounded-md focus:outline-none'
                                                            rows={2}
                                                            {...register(
                                                                "preferences.addressDetails.fullAddress"
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <button className='ButtonBlue text-white px-8 py-1 rounded-lg font-semibold'>
                                    Save
                                </button>
                            </div>
                        </div>
                    </section>
                </form>

                {/* Table */}
                <div className='bg-white px-4 sm:px-6 md:px-12 lg:px-24'>
                    {order?.assignedCreators?.length > 0 ? (
                        <table className='text-xs lg:text-sm w-auto lg:min-w-full bg-white'>
                            <thead>
                                <tr>
                                    <th className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 text-start border'>
                                        No
                                    </th>
                                    <th className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 text-start border'>
                                        Creator ID
                                    </th>
                                    <th className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 text-start border'>
                                        File URL
                                    </th>
                                    <th className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 text-start border'>
                                        Upload Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.assignedCreators.map(
                                    (creator, index) => {
                                        const hasFiles =
                                            order.uploadFiles &&
                                            order.uploadFiles.length > 0;
                                        return hasFiles ? (
                                            order.uploadFiles &&
                                                order.uploadFiles.map(
                                                    (file, i) =>
                                                        file.fileUrls.map(
                                                            (f, j) => (
                                                                <tr
                                                                    key={`${
                                                                        (
                                                                            creator as CreatorInterface
                                                                        )._id
                                                                    }-${i}-${j}`}
                                                                >
                                                                    {/* Index Column */}
                                                                    <td className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 border text-xs lg:text-sm'>
                                                                        {index +
                                                                            1}
                                                                    </td>

                                                                    {/* Creator ID Column */}
                                                                    <td className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 border text-xs lg:text-sm'>
                                                                        {
                                                                            (
                                                                                creator as CreatorInterface
                                                                            )
                                                                                ?._id
                                                                        }
                                                                    </td>

                                                                    {/* File URL Column */}
                                                                    <td className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 border'>
                                                                        <a
                                                                            className='text-xs lg:text-sm BlueText block whitespace-normal lg:whitespace-nowrap'
                                                                            href={
                                                                                f
                                                                            }
                                                                            target='_blank'
                                                                            rel='noopener noreferrer'
                                                                        >
                                                                            {f}
                                                                        </a>
                                                                    </td>

                                                                    {/* Upload Date Column */}
                                                                    <td className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 border text-xs lg:text-sm text-gray-600'>
                                                                        {file?.uploadedDate
                                                                            ? new Date(
                                                                                  file.uploadedDate
                                                                              ).toLocaleDateString()
                                                                            : "No Date Available"}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                )
                                        ) : (
                                            <tr
                                                key={
                                                    (
                                                        creator as CreatorInterface
                                                    )._id
                                                }
                                            >
                                                {/* Index Column */}
                                                <td className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 border text-xs lg:text-sm'>
                                                    {index + 1}
                                                </td>

                                                {/* Creator ID Column */}
                                                <td className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 border text-xs lg:text-sm'>
                                                    {
                                                        (
                                                            creator as CreatorInterface
                                                        )?._id
                                                    }
                                                </td>

                                                {/* No Files Uploaded Column */}
                                                <td
                                                    className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 border text-xs lg:text-sm text-center'
                                                    colSpan={2}
                                                >
                                                    No Files Uploaded
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className='text-xs lg:text-sm w-auto lg:min-w-full bg-white'>
                            <thead>
                                <tr>
                                    <th className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 text-start border'>
                                        No
                                    </th>
                                    <th className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 text-start border'>
                                        Creator ID
                                    </th>
                                    <th className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 text-start border'>
                                        File URL
                                    </th>
                                    <th className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4 text-start border'>
                                        Upload Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        colSpan={4}
                                        className='py-0.5 px-0.5 sm:py-0.5 sm:px-0.5 md:py-2 md:px-4 lg:py-2 lg:px-4  border text-xs lg:text-sm text-center'
                                    >
                                        <p className='text-xs lg:text-sm'>
                                            No Creators assigned yet
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Revision Request */}
                <div className='bg-white px-4 sm:px-6 md:px-12 lg:px-24'>
                    <form>
                        <div className='bg-white py-4 sm:py-5 md:py-6 lg:py-6 rounded-md'>
                            <h2 className='text-base font-semibold mb-1'>
                                Revision Request
                            </h2>
                            <div className=' mb-2 sm:mb-3 md:mb-3 lg:mb-4'>
                                <textarea
                                    className='w-full p-2 sm:p-3 md:p-4 lg:p-4 border rounded-lg focus:outline-none'
                                    rows={4}
                                    placeholder='If you have any issues regarding the order feel free to ask us'
                                />
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <button className='ButtonBlue text-white px-8 py-1 rounded-lg font-semibold'>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
