"use client";
import { useState } from "react";
import Image from "next/image";

const ContentCreatorPreferences: React.FC<{
    register: any;
    watch: any;
    errors: any;
}> = ({ register, watch, errors }) => {
    const [showTooltipTwo, setShowTooltipTwo] = useState(false);
    const [showTooltipThree, setShowTooltipThree] = useState(false);
    // Replace your existing contentType watch with this:
    const contentTypes =
        watch("preferences.contentInformation.contentType") || [];

    return (
        <div className='px-4 sm:px-6 md:px-8 lg:px-28'>
            <div className='bg-white p-4 sm:p-5 md:p-6 lg:p-6'>
                <h1 className='text-xl font-bold'>
                    İçerik Üreticisi Tercihleri
                </h1>

                <section className='mt-12 flex flex-col justify-between'>
                    <div className='flex flex-col md:flex-row justify-between gap-8'>
                        <div className='w-full lg:w-2/3'>
                            {/* İçerik Türü */}
                            <div className='mb-4 w-full '>
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
                                                Ürün tanıtımı gerçekleştiren
                                                içerik üreticilerinin belirttiği
                                                adrese ürün gönderimi yapılır.
                                                Ürün, marka tarafından içerik
                                                üreticisine hediye edilmektedir.
                                                Mekan tanıtımı gerçekleştiren
                                                içerik üreticileri, kendine
                                                yakın lokasyonda bulunan
                                                mekanlara giderek içerik
                                                üretecekleri için adres
                                                bilgileri alınmaktadır.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    UGC’lerinizde tanıtım gerektiren, içerik
                                    türünüzü seçin
                                </label>

                                {/* content_type */}
                                <div className='w:1/3 flex justify-between space-x-4'>
                                    <label className='inline-flex items-center cursor-pointer mb-2 lg:mb-6'>
                                        <input
                                            type='checkbox'
                                            value='product'
                                            {...register(
                                                "preferences.contentInformation.contentType"
                                            )}
                                            defaultChecked
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
                                            type='checkbox'
                                            value='service'
                                            {...register(
                                                "preferences.contentInformation.contentType"
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
                                            type='checkbox'
                                            value='location'
                                            {...register(
                                                "preferences.contentInformation.contentType"
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
                                {errors.preferences?.contentInformation
                                    ?.contentType && (
                                    <span className='text-red-500 text-xs'>
                                        {
                                            errors.preferences
                                                .contentInformation.contentType
                                                .message
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className='w-full lg:w-1/3 mt-8'>
                            {(contentTypes.includes("location") ||
                                contentTypes.includes("product")) && (
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
                                                    setShowTooltipThree(true)
                                                }
                                                onMouseLeave={() =>
                                                    setShowTooltipThree(false)
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
                                                   <i> Adres bilgileri, tüm içerik 
                                                    üreticileri tarafından İl, 
                                                    İlçe ve Mahalle olarak 
                                                    gösterilecektir. Onaylanan 
                                                    içerik üreticiler, işletme 
                                                    adı ve açık adresi 
                                                    görüntüleyebilecektir.</i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Lütfen markaların ürün gönderimi
                                        yapabilmesi için adresinizi belirtin.
                                    </label>
                                    <div className='grid lg:grid-cols-2 gap-x-8 gap-y-8'>
                                        <div>
                                            <label className='block text-sm font-semibold mb-2'>
                                                Ülke
                                            </label>
                                            <input
                                                className='w-full px-3 py-2 border rounded-md focus:outline-none'
                                                {...register(
                                                    "preferences.contentInformation.addressDetails.country"
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-semibold mb-2'>
                                                İl
                                            </label>
                                            <input
                                                className='w-full px-3 py-2 border rounded-md focus:outline-none'
                                                {...register(
                                                    "preferences.contentInformation.addressDetails.state"
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-semibold mb-2'>
                                                İlçe
                                            </label>
                                            <input
                                                className='w-full px-3 py-2 border rounded-md focus:outline-none'
                                                {...register(
                                                    "preferences.contentInformation.addressDetails.district"
                                                )}
                                            />
                                        </div>

                                        <div>
                                            <label className='block text-sm font-semibold mb-2'>
                                                Mahalle
                                            </label>
                                            <input
                                                className='w-full px-3 py-2 border rounded-md focus:outline-none'
                                                {...register(
                                                    "preferences.contentInformation.addressDetails.neighborhood"
                                                )}
                                            />
                                        </div>

                                        <div className='col-span-2'>
                                            <label className='block text-sm font-semibold mb-2'>
                                                İşletme Adı & Adres
                                            </label>
                                            <textarea
                                                placeholder='Lütfen işletme adını ve açık adres bilgilerini girin.'
                                                className='w-full text-sm px-3 py-2 border rounded-md focus:outline-none'
                                                rows={3}
                                                {...register(
                                                    "preferences.contentInformation.addressDetails.fullAddress"
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* content formatter */}
                    <div className='mt-9'>
                        <h1 className='text-lg font-bold'>
                            İçerik Formatları:
                        </h1>
                        <p className='mb-2'>
                            Profiliniz ile eşleşen içerik alanlarını belirleyin
                        </p>
                        <div className='w-full mt-2 grid-cols-1'>
                            {[
                                "Instagram Reels",
                                "Instagram Story",
                                "TikTok video",
                                "Instagram Post",
                                "Youtube Video",
                                "Linkedin Post",
                                "X-Flood",
                            ].map((format, index) => (
                                <label
                                    key={index}
                                    className='whitespace-nowrap flex items-center cursor-pointer mb-2 lg:mb-6'
                                >
                                    <input
                                        type='checkbox'
                                        {...register(
                                            "preferences.contentInformation.contentFormats"
                                        )}
                                        value={format}
                                        className='hidden peer'
                                    />
                                    <div className='w-5 h-5 p-1 border-2 BlueBorder rounded-full peer-checked:bg-[#4D4EC9] transition-all duration-300 ease-in-out'>
                                        <div className='w-full h-full bg-white rounded-full'></div>
                                    </div>
                                    <span className='ml-1 text-sm'>
                                        {format}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* area_of_interest */}
                <section className='mt-9'>
                    <h1 className='text-lg font-bold'>İlgi Alanları:</h1>
                    <p className='mb-2'>
                        Profiliniz ile eşleşen içerik alanlarını belirleyin
                    </p>
                    <div className='w-full lg:w-2/3 mt-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {[
                            "Moda",
                            "Giyim",
                            "Makyaj ve Kozmetik",
                            "Saç ve Bakım",
                            "Cilt Bakımı",
                            "Ayakkabı",
                            "Evcil Hayvanlar",
                            "Araba",
                            "Motorsiklet",
                            "Gayrimenkul",
                            "Yemek Tarifi",
                            "Restoranlar",
                            "Gastronomi Yeme İçme",
                            "Seyahat",
                            "Fitness ve Sağlık",
                            "Spor",
                            "Teknoloji",
                            "Elektronik",
                            "Eğitim",
                            "Kişisel Gelişim",
                            "Fotoğrafçılık",
                            "Müzik",
                            "Film ve Dizi",
                            "Tiyatro",
                            "Edebiyat",
                            "E-Ticaret",
                            "Finans Piyasaları",
                            "İş / Business",
                            "Eğlence ve Oyun",
                            "Sağlık",
                            "İnşaat ve Tadilat",
                            "Doğa",
                        ].map((item, index) => (
                            <label
                                key={index}
                                className='w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 inline-flex items-center cursor-pointer mb-2 lg:mb-6'
                            >
                                <input
                                    type='checkbox'
                                    value={item}
                                    className='hidden peer '
                                    {...register(
                                        "preferences.contentInformation.areaOfInterest"
                                    )}
                                />
                                <div className='w-5 h-5 p-1 border-2 BlueBorder rounded-full peer-checked:bg-[#4D4EC9] transition-all duration-300 ease-in-out'>
                                    <div className='w-full h-full bg-white rounded-full'></div>
                                </div>
                                <span className='ml-1 text-sm'>{item}</span>
                            </label>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ContentCreatorPreferences;
