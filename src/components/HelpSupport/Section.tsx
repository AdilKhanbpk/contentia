"use client";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import img1 from "../../../public/helpcenter/img1.svg";
import img2 from "../../../public/helpcenter/img2.svg";
import img3 from "../../../public/helpcenter/img3.svg";
import img4 from "../../../public/helpcenter/img4.svg";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
    fetchHelpSupports,
    HelpSupport,
} from "@/store/features/admin/helpSlice";

const helpCategories = [
    {
        title: "Sipariş Oluşturma",
        value: "Sipariş Oluşturma", // Match exact category from API
        icon: (
            <Image
                src={img1}
                alt='img1'
            />
        ),
    },
    {
        title: "Contentia Nasıl Çalışır?",
        value: "Contentia Nasıl Çalışır",
        icon: (
            <Image
                src={img2}
                alt='img2'
            />
        ),
    },
    {
        title: "Kullanım Koşulları",
        value: "Kullanım Koşulları", // Match exact category from API
        icon: (
            <Image
                src={img3}
                alt='img3'
            />
        ),
    },
    {
        title: "İçerik Üreticileri",
        value: "İçerik Üreticileri", // Match exact category from API
        icon: (
            <Image
                src={img4}
                alt='img4'
            />
        ),
    },
];

const HelpSupportPage: React.FC = () => {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const { helpSupports: helpSupportData } = useSelector(
        (state: any) => state.helpSupport
    );
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchHelpSupports());
    }, [dispatch]);

    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
            const categoryIndex = helpCategories.findIndex(
                (category) => category.value === categoryParam
            );
            if (categoryIndex !== -1) {
                setSelectedCategory(categoryIndex);
            }
        }
    }, [searchParams]);

    const filteredHelpSupports = helpSupportData.filter(
        (support: HelpSupport) => {
            // If there's a search query, search across all categories and content
            if (searchQuery.trim() !== "") {
                return (
                    support.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    support.content
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                );
            }

            // If no search query, show only items from selected category
            return support.category === helpCategories[selectedCategory].value;
        }
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryClick = (index: number) => {
        setSelectedCategory(index);
        setSearchQuery(""); // Clear search when changing category
    };

    return (
        <div className='px-4 sm:px-6 md:px-8 lg:px-32'>
            <div className='py-24 sm:py-24 md:py-24 lg:py-[100px]'>
                <div className='border border-gray-400 rounded-md p-2 sm:p-4 md:p-8 lg:px-12 lg:py-8'>
                    <div>
                        <h4 className='text-gray-600'>Merhaba</h4>
                        <h1 className='w-full mt-1 text-xl md:text-3xl font-semibold text-gray-800 whitespace-nowrap'>
                            Hangi konuda desteğe <br /> ihtiyacınız var?
                        </h1>
                        <div
                            className='flex gap-3 p-2 items-center rounded-md mt-4 mb-4 bg-gray-200'
                            style={{ color: "#6C757D" }}
                        >
                            <CiSearch size={20} />
                            <input
                                type='text'
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder='Destek almak istediğiniz konu nedir?'
                                className='outline-none w-full bg-transparent py-1'
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className='flex flex-wrap justify-between gap-1 mt-4'>
                        {helpCategories.map((category, index) => (
                            <div
                                key={index}
                                className={`px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 lg:px-8 lg:py-4 
                                    rounded-md text-white flex flex-col items-center cursor-pointer 
                                    transition-all hover:ring-2 hover:ring-offset-2 hover:ring-blue-400
                                    ${
                                        selectedCategory === index
                                            ? "ring-2 ring-offset-2 ring-blue-500"
                                            : ""
                                    }`}
                                style={{ backgroundColor: "#4D4EC9" }}
                                onClick={() => handleCategoryClick(index)}
                            >
                                <div className='flex flex-col items-center'>
                                    {category.icon}
                                    <h2 className='text-xs md:text-sm text-center mt-0.5 md:mt-2'>
                                        {category.title}
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filtered Help Supports */}
                    <div className='flex flex-col gap-4 mt-8 font-medium'>
                        {filteredHelpSupports.length > 0 ? (
                            filteredHelpSupports.map(
                                (helpSupport: HelpSupport) => (
                                    <div
                                        className='flex gap-3 items-center p-4 hover:bg-gray-50 
                                            rounded-lg transition-colors duration-200'
                                        key={helpSupport._id}
                                    >
                                        <Image
                                            src={helpSupport.icon}
                                            width={30}
                                            height={30}
                                            alt={helpSupport.title}
                                        />
                                        <Link
                                            href={`/destek-merkezi/detail/${helpSupport._id}`}
                                        >
                                            <span className='cursor-pointer hover:underline'>
                                                {helpSupport.title}
                                            </span>
                                        </Link>
                                    </div>
                                )
                            )
                        ) : (
                            <p className='text-gray-500 text-center py-4'>
                                Bu kategoride içerik bulunamadı.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupportPage;
