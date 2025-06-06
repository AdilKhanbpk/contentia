"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
    fetchFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
} from "@/store/features/admin/faqSlice";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import CustomModelAdmin from "../../../modal/CustomModelAdmin";
import CustomTable from "@/components/custom-table/CustomTable";
import { exportCsvFile } from "@/utils/exportCsvFile";
import { toast } from "react-toastify";
import RichTextEditor from "@/components/common/RichTextEditor";

export interface FAQ {
    _id?: string;
    question: string;
    answer: string;
}

const SearchBar = memo(
    ({ onSearch }: { onSearch: (value: string) => void }) => (
        <input
            type='text'
            placeholder='Search...'
            onChange={(e) => onSearch(e.target.value)}
            className='p-2 border border-gray-300 rounded-lg'
        />
    )
);

SearchBar.displayName = "SearchBar";

const TableActions = memo(
    ({
        onDelete,
        onEdit,
        onView,
        id,
    }: {
        onDelete: (id: string) => void;
        onEdit: (id: string) => void;
        onView: (id: string) => void;
        id: string;
    }) => (
        <div className='flex space-x-3'>
            <button
                className='text-gray-500 hover:text-gray-700'
                onClick={() => onView(id)}
            >
                <FaEye className='text-lg' />
            </button>
            <button
                className='text-blue-500 hover:text-blue-700'
                onClick={() => onEdit(id)}
            >
                <FaEdit className='text-lg' />
            </button>
            <button
                className='text-red-500 hover:text-red-700'
                onClick={() => onDelete(id)}
            >
                <FaTrashAlt className='text-md' />
            </button>
        </div>
    )
);

TableActions.displayName = "TableActions";

const ModalFAQs = memo(
    ({
        initialData,
        onSubmit,
        onClose,
        mode,
    }: {
        initialData?: FAQ;
        onSubmit: (data: FAQ) => void;
        onClose: () => void;
        mode: "create" | "edit" | "view";
    }) => {
        const [question, setQuestion] = useState(initialData?.question || "");
        const [answer, setAnswer] = useState(initialData?.answer || "");

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSubmit({
                _id: initialData?._id,
                question,
                answer,
            });
        };

        const isViewMode = mode === "view";

        return (
            <div className='bg-white my-4 p-4 sm:my-6 sm:p-5 md:my-8 md:p-6 lg:my-8 lg:p-6'>
                <h1 className='text-lg font-semibold'>FAQ</h1>

                <form onSubmit={handleSubmit}>
                    <div className='flex flex-row space-x-8'>
                        <div className='mt-4 w-full'>
                            <label className='block text-sm font-semibold'>
                                Question
                            </label>
                            {isViewMode ? (
                                <p className='mt-2'>{question}</p>
                            ) : (
                                <input
                                    type='text'
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(e.target.value)
                                    }
                                    placeholder='Enter question'
                                    className='w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none'
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className='mt-4'>
                        <label className='block text-sm font-semibold'>
                            Answer
                        </label>
                        {isViewMode ? (
                            <div
                                className='prose prose-sm sm:prose lg:prose-lg max-w-none mt-4 text-gray-700'
                                dangerouslySetInnerHTML={{ __html: answer }}
                            />
                        ) : (
                            <RichTextEditor
                                value={answer}
                                onChange={setAnswer}
                                placeholder='Write answer...'
                                className='w-full border border-gray-400 rounded-lg focus:outline-none'
                            />
                        )}
                    </div>

                    {!isViewMode && (
                        <div className='flex justify-end mt-6 space-x-4'>
                            <button
                                type='button'
                                onClick={onClose}
                                className='px-4 py-2 bg-gray-500 text-white rounded-md'
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                className='Button text-white px-8 py-2 rounded-md'
                            >
                                {mode === "edit" ? "Update" : "Save"}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        );
    }
);

ModalFAQs.displayName = "ModalFAQs";

const FAQs: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { faqs } = useSelector((state: RootState) => state.faq);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
        "create"
    );
    const [currentFAQ, setCurrentFAQ] = useState<FAQ | null>(null);

    useEffect(() => {
        dispatch(fetchFaqs())
            .then(() => {
                toast.success("FAQs fetched successfully!");
            })
            .catch(() => {
                toast.error("Failed to fetch FAQs!");
            });
    }, [dispatch]);

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleModalOpen = useCallback(
        (mode: "create" | "edit" | "view", faq?: FAQ) => {
            setModalMode(mode);
            setCurrentFAQ(faq || null);
            setIsModalOpen(true);
        },
        []
    );

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
        setCurrentFAQ(null);
    }, []);

    const handleSubmit = useCallback(
        async (data: FAQ) => {
            try {
                if (modalMode === "edit" && currentFAQ?._id) {
                    await dispatch(
                        updateFaq({
                            faqId: currentFAQ._id,
                            data,
                        })
                    ).unwrap();
                    toast.success("FAQ updated successfully!");
                } else {
                    await dispatch(createFaq({ data })).unwrap();
                    toast.success("FAQ created successfully!");
                }
                handleModalClose();
                dispatch(fetchFaqs());
            } catch (error) {
                toast.error(
                    "Something went wrong while processing your request."
                );
            }
        },
        [dispatch, modalMode, currentFAQ, handleModalClose]
    );

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                await dispatch(deleteFaq({ faqId: id })).unwrap();
                toast.success("FAQ deleted successfully!");
                dispatch(fetchFaqs());
            } catch (error) {
                toast.error("Something went wrong while deleting the FAQ.");
            }
        },
        [dispatch]
    );

    const handleExport = useCallback(() => {
        const headers = ["ID", "Question"];
        const data = faqs.map((faq) => ({
            ID: faq._id,
            Question: faq.question,
        }));
        exportCsvFile({ data, headers, filename: "faqs.csv" });
    }, [faqs]);

    const columns = React.useMemo(
        () => [
            {
                name: "#",
                selector: (_row: any, index: number) => index + 1,
                sortable: true,
                width: "80px",
            },
            {
                name: "Question",
                selector: (row: FAQ) => row.question,
                sortable: true,
                grow: 2,
            },
            {
                name: "Actions",
                cell: (row: FAQ) => (
                    <TableActions
                        onDelete={() => handleDelete(row._id!)}
                        onEdit={() => handleModalOpen("edit", row)}
                        onView={() => handleModalOpen("view", row)}
                        id={row._id!}
                    />
                ),
                width: "150px",
            },
        ],
        [handleDelete, handleModalOpen]
    );

    const filteredFAQs = React.useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
        return faqs.filter(
            (faq) =>
                faq.question.toLowerCase().includes(lowerCaseSearchTerm) ||
                faq.answer.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [faqs, searchTerm]);

    return (
        <div className='bg-white rounded-lg'>
            <div className='flex flex-col py-24 md:py-24 lg:my-0 px-4 sm:px-6 md:px-12 lg:pl-72'>
                <div className='flex flex-row justify-between items-center mb-4 space-x-2'>
                    <div className='flex justify-center items-center'>
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    <div className='flex flex-row space-x-2'>
                        <button
                            onClick={() => handleModalOpen("create")}
                            className='px-4 py-2 Button text-white rounded-md'
                        >
                            Add FAQ
                        </button>
                        <button
                            onClick={handleExport}
                            className='px-4 py-2 bg-green-500 text-white rounded-md'
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                <CustomTable
                    columns={columns}
                    data={filteredFAQs}
                    noDataComponent='No Faqs Found'
                />
            </div>

            <CustomModelAdmin
                isOpen={isModalOpen}
                closeModal={handleModalClose}
                title=''
            >
                <ModalFAQs
                    initialData={currentFAQ || undefined}
                    onSubmit={handleSubmit}
                    onClose={handleModalClose}
                    mode={modalMode}
                />
            </CustomModelAdmin>
        </div>
    );
};

export default FAQs;
