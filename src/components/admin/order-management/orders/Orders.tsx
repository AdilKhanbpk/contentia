"use client";

import React, { useState, useCallback, memo, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import CustomModelAdmin from "../../../modal/CustomModelAdmin";
import NewModal from "../sub-order/NewModal";
import EditModal from "../sub-order/EditModal";
import RequestModal from "../sub-order/RequestModal";
import CustomTable from "@/components/custom-table/CustomTable";
import { exportCsvFile } from "@/utils/exportCsvFile";
import {
    fetchOrders,
    deleteOrder,
    fetchOrderById,
    approveCreator,
    rejectCreator,
    clearCurrentOrder,
} from "@/store/features/admin/ordersSlice";
import { RootState } from "@/store/store";
import { toast } from "react-toastify";
import { CreatorInterface, OrderInterface } from "@/types/interfaces";

interface SearchBarProps {
    onSearch: (value: string) => void;
}

interface TableActionsProps {
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onView: (id: string) => void;
    onRequest: (id: string) => void;
    id: string;
}

const SearchBar = memo(({ onSearch }: SearchBarProps) => (
    <input
        type='text'
        placeholder='Search...'
        onChange={(e) => onSearch(e.target.value)}
        className='p-2 border border-gray-300 rounded-lg'
    />
));

SearchBar.displayName = "SearchBar";

const TableActions = memo(
    ({ onDelete, onEdit, onView, onRequest, id }: TableActionsProps) => (
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
            <button
                onClick={() => onRequest(id)}
                className='text-gray-500 hover:text-gray-700'
            >
                <Image
                    width={20}
                    height={20}
                    src='/icons/creatorRequest.png'
                    alt='creator request icon'
                />
            </button>
        </div>
    )
);

TableActions.displayName = "TableActions";

const Orders: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        data: orders,
        loading,
        error,
        currentOrder,
    } = useSelector((state: RootState) => state.orders);
    // console.log("orders fetched successfully", orders);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalRequestsOpen, setIsModalRequestsOpen] = useState(false);

    useEffect(() => {
        const fetchOrdersData = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.error("No token found. Please log in again.");
                return;
            }
            try {
                const res = await dispatch(fetchOrders(token)).unwrap();
                toast.success(res.message);
            } catch (error: any) {
                toast.error(error.message);
            }
        };

        fetchOrdersData();
    }, [dispatch]);

    const handleDelete = useCallback(
        async (id: string) => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.error("No token found. Please log in again.");
                return;
            }

            try {
                await dispatch(deleteOrder({ orderId: id, token })).unwrap();
                toast.success("Order deleted successfully!");
            } catch (error) {
                toast.error("Error deleting order.");
            }
        },
        [dispatch]
    );

    const handleView = useCallback(
        async (id: string) => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.error("No token found. Please log in again.");
                return;
            }

            try {
                await dispatch(fetchOrderById({ orderId: id, token })).unwrap();
                toast.success("Order details fetched successfully!");
            } catch (error) {
                toast.error("Error fetching order details.");
            }
        },
        [dispatch]
    );

    const handleEdit = useCallback(
        async (id: string) => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.error("No token found. Please log in again.");
                return;
            }

            try {
                await dispatch(fetchOrderById({ orderId: id, token })).unwrap();
                setIsModalEditOpen(true);
                toast.success("Order fetched successfully for editing.");
            } catch (error) {
                toast.error("Error fetching order for editing.");
            }
        },
        [dispatch]
    );

    const handleRequest = useCallback(
        async (id: string) => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.error("No token found. Please log in again.");
                return;
            }

            try {
                await dispatch(fetchOrderById({ orderId: id, token })).unwrap();
                setIsModalRequestsOpen(true);
                toast.success(
                    "Order fetched successfully for creator requests."
                );
            } catch (error) {
                toast.error("Error fetching order for creator requests.");
            }
        },
        [dispatch]
    );

    const handleApproveCreator = useCallback(
        async (orderId: string, creatorId: string) => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.error("No token found. Please log in again.");
                return;
            }

            try {
                await dispatch(
                    approveCreator({ orderId, creatorId, token })
                ).unwrap();
                toast.success("Creator approved successfully.");
            } catch (error) {
                toast.error("Error approving creator.");
            }
        },
        [dispatch]
    );

    const handleRejectCreator = useCallback(
        async (orderId: string, creatorId: string) => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.error("No token found. Please log in again.");
                return;
            }

            try {
                await dispatch(
                    rejectCreator({ orderId, creatorId, token })
                ).unwrap();
                toast.success("Creator rejected successfully.");
            } catch (error) {
                toast.error("Error rejecting creator.");
            }
        },
        [dispatch]
    );

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleExport = useCallback(() => {
        const headers = [
            "ID",
            "Order Owner",
            "No of UGC",
            "Total Price",
            "Order Status",
            "Payment Status",
            "Contents Delivered",
            "Created At",
        ];

        const data = orders.map((order) => ({
            ID: order._id,
            "Order Owner": order.orderOwner,
            "No of UGC": order.noOfUgc,
            "Total Price": order.totalPrice,
            "Order Status": order.orderStatus,
            "Payment Status": order.paymentStatus,
            "Contents Delivered": order.contentsDelivered || 0,
            "Created At": order.createdAt,
        }));

        exportCsvFile({ data, headers, filename: "orders.csv" });
    }, [orders]);

    const handleCloseModals = useCallback(() => {
        setIsModalOpen(false);
        setIsModalEditOpen(false);
        setIsModalRequestsOpen(false);
        dispatch(clearCurrentOrder());
    }, [dispatch]);

    const columns = React.useMemo(
        () => [
            {
                name: "#Order Id",
                selector: (row: OrderInterface) => row._id,
                sortable: true,
            },
            {
                name: "Order Owner",
                cell: (row: OrderInterface) => {
                    const owner = row.orderOwner;
                    const isValidOwner =
                        owner && typeof owner === "object" && owner !== null;

                    return (
                        <div className='flex items-center space-x-2'>
                            <Image
                                width={10}
                                height={10}
                                src='/icons/avatar.png'
                                alt='avatar'
                                className='w-10 h-10 rounded-full'
                            />
                            <div>
                                <p className='font-semibold'>
                                    {isValidOwner && owner.fullName
                                        ? owner.fullName
                                        : "No Name"}
                                </p>
                                <p className='text-sm text-gray-500'>
                                    {isValidOwner && owner.email
                                        ? owner.email
                                        : "No Email"}
                                </p>
                            </div>
                        </div>
                    );
                },
                sortable: false,
            },
            {
                name: "No of UGC",
                selector: (row: OrderInterface) => row.noOfUgc,
                sortable: true,
            },
            {
                name: "Creators Assigned",
                selector: (row: OrderInterface) => row.assignedCreators.length,
                sortable: true,
            },
            {
                name: "Contents Delivered",
                selector: (row: OrderInterface) => row.contentsDelivered || 0,
                sortable: true,
            },
            {
                name: "Order Status",
                cell: (row: OrderInterface) => (
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            row.orderStatus === "completed"
                                ? "text-green-700 bg-green-100"
                                : row.orderStatus === "pending"
                                ? "text-yellow-700 bg-yellow-100"
                                : "text-red-700 bg-red-100"
                        }`}
                    >
                        {row.orderStatus.charAt(0).toUpperCase() +
                            row.orderStatus.slice(1)}
                    </span>
                ),
                sortable: true,
            },
            {
                name: "Actions",
                cell: (row: OrderInterface) => (
                    <TableActions
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onView={handleView}
                        onRequest={handleRequest}
                        id={row._id}
                    />
                ),
            },
        ],
        [handleDelete, handleEdit, handleView, handleRequest]
    );

    // Update the filtering logic as well
    const filteredOrders = React.useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
        console.log("🚀 ~ filteredOrders ~ orders:", orders);
        return orders?.filter((order) => {
            const owner = order.orderOwner;
            const fullNameMatch =
                owner &&
                typeof owner === "object" &&
                owner.fullName &&
                owner.fullName.toLowerCase().includes(lowerCaseSearchTerm);
            const idMatch = order._id
                ?.toLowerCase()
                .includes(lowerCaseSearchTerm);
            return fullNameMatch || idMatch;
        });
    }, [orders, searchTerm]);

    return (
        <div className='bg-white rounded-lg'>
            <div className='flex flex-col py-24 md:py-24 lg:my-0 px-4 sm:px-6 md:px-12 lg:pl-72'>
                <div className='flex flex-row justify-between items-center mb-4 space-x-2'>
                    <div className='flex justify-center items-center'>
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    <div className='flex flex-row space-x-2'>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className='px-4 py-2 ButtonBlue text-white rounded-md'
                        >
                            Add Order
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
                    data={filteredOrders}
                />
            </div>

            <CustomModelAdmin
                isOpen={isModalOpen}
                closeModal={handleCloseModals}
                title=''
            >
                <NewModal />
            </CustomModelAdmin>

            <CustomModelAdmin
                isOpen={isModalEditOpen}
                closeModal={handleCloseModals}
                title=''
            >
                <EditModal order={currentOrder} />
            </CustomModelAdmin>

            <CustomModelAdmin
                isOpen={isModalRequestsOpen}
                closeModal={handleCloseModals}
                title=''
            >
                <RequestModal
                    order={currentOrder}
                    onApprove={handleApproveCreator}
                    onReject={handleRejectCreator}
                />
            </CustomModelAdmin>
        </div>
    );
};

export default Orders;
