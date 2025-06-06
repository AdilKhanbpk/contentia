import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import influencerMarketingImage1 from "../../../../public/blog/influencer-marketing1.svg";
import Pagination from "./pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchBlogs } from "@/store/features/admin/blogSlice";
import { BlogInterface } from "@/types/interfaces";

interface BlogCardProps {
    activeCategory: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ activeCategory }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { blogs } = useSelector((state: RootState) => state.blog);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 6;

    const filteredBlogs =
        activeCategory === "all"
            ? blogs
            : blogs.filter((blog) => blog.category === activeCategory);

    const totalPages = Math.ceil((filteredBlogs.length || 0) / blogsPerPage);

    const currentBlogs = filteredBlogs.slice(
        (currentPage - 1) * blogsPerPage,
        currentPage * blogsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
        });
    };

    const estimateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min read`;
    };

    return (
        <div className='my-28'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
                {currentBlogs.map((blog: BlogInterface) => (
                    <div
                        key={blog._id}
                        className='w-full rounded-md shadow-md p-4 flex flex-col items-center bg-white'
                    >
                        <Image
                            src={blog.bannerImage || influencerMarketingImage1}
                            alt={blog.title}
                            priority
                            width={300}
                            height={200}
                            className='w-[400px] h-[200px] object-cover rounded-md mx-auto'
                        />
                        <div className='px-2 mt-2 text-center'>
                            <p className='text-gray-600'>
                                {formatDate(blog.createdAt)} -{" "}
                                {estimateReadTime(blog.content)}
                            </p>
                            <p className='text-sm font-semibold mt-1'>
                                {blog.title}
                            </p>
                            <Link href={`/blog/details/${blog._id}`}>
                                <button className='border w-full p-2 rounded-full BlueText BlueBorder mt-4 transition'>
                                    Devamını Oku
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className='flex justify-center mt-6'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default BlogCard;
