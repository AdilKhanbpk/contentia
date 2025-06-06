"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
    fetchAdminCustomers,
    deleteAdminCustomer,
    createAdminCustomer,
    updateAdminCustomer,
    fetchAdmins,
} from "@/store/features/admin/customersSlice";

import CustomModelAdmin from "../../../modal/CustomModelAdmin";
import CustomTable from "@/components/custom-table/CustomTable";
import { exportCsvFile } from "@/utils/exportCsvFile";
import { toast } from "react-toastify";
import { Customer } from "@/types/interfaces";
import ModalNew from "./sub-admin/ModalNew";
import ModalView from "./sub-admin/ModalView";
import ModalEdit from "./sub-admin/ModalEdit";

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

const Admins: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { adminData: customers = [], loading } = useSelector(
        (state: RootState) => state.adminCustomers
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalViewOpen, setIsModalViewOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<any>(null);

    const handleDelete = useCallback(
        (id: string) => {
            dispatch(deleteAdminCustomer({ customerId: id }))
                .unwrap()
                .then(() => {
                    toast.success("Admin deleted successfully!");
                })
                .catch((error: any) => {
                    toast.error("Failed to delete admin. Please try again.");
                });
        },
        [dispatch]
    );

    const handleView = (id: string) => {
        const customer = customers.find((customer: any) => customer._id === id);
        if (customer) {
            setCurrentCustomer({ ...customer }); // Ensure a new reference
            setIsModalViewOpen(true);
        } else {
            toast.error("Admin not found.");
        }
    };

    const handleCreate = async (customerData: any) => {
        if (!customerData || Object.keys(customerData).length === 0) {
            toast.error("Admin data is missing or empty.");
            return;
        }

        const result = await dispatch(
            createAdminCustomer({
                data: customerData,
            })
        ).unwrap();

        setIsModalOpen(false);
        await dispatch(fetchAdmins());
        toast.success("Admin created successfully!");
    };

    const handleUpdate = async (customerData: Customer) => {
        const customerId = customerData._id;
        const dataToUpdate = {
            fullName: customerData.fullName ?? "",
            email: customerData.email ?? "",
            age: customerData.age ?? null,
            phoneNumber: customerData.phoneNumber ?? "",
            customerStatus: customerData.customerStatus ?? "",
            invoiceType: customerData.invoiceType ?? "",
            role: customerData.role ?? "admin",
            billingInformation: {
                invoiceStatus:
                    customerData.billingInformation?.invoiceStatus ?? false,
                trId: customerData.billingInformation?.trId ?? "",
                address: customerData.billingInformation?.address ?? "",
                fullName: customerData.billingInformation?.fullName ?? "",
                companyName: customerData.billingInformation?.companyName ?? "",
                taxNumber: customerData.billingInformation?.taxNumber ?? "",
                taxOffice: customerData.billingInformation?.taxOffice ?? "",
            },
            rememberMe: customerData.rememberMe ?? false,
            termsAndConditionsApproved:
                customerData.termsAndConditionsApproved ?? false,
        };

        try {
            customerId &&
                (await dispatch(
                    updateAdminCustomer({
                        customerId,
                        data: dataToUpdate,
                    })
                ));
            await dispatch(fetchAdmins());
            toast.success("Admin updated successfully!");
        } catch (error) {
            toast.error("Failed to update admin. Please try again.");
        }
    };

    const handleEdit = (id: string) => {
        const customer = customers.find((customer: any) => customer._id === id);
        if (customer) {
            setCurrentCustomer({ ...customer });
            setIsModalEditOpen(true);
        } else {
            toast.error("Customer not found.");
        }
    };

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleExport = useCallback(() => {
        const headers = ["ID", "Name", "Email", "Phone", "Age"];
        const data = customers.map((customer) => ({
            ID: customer._id,
            Name: customer.fullName,
            Email: customer.email,
            Phone: customer.phoneNumber,
            Age: customer.age,
        }));

        exportCsvFile({ data, headers, filename: "customers.csv" });
    }, [customers]);

    useEffect(() => {
        dispatch(fetchAdmins());
    }, [dispatch]);

    const columns = React.useMemo(
        () => [
            {
                name: "# Admin Id",
                selector: (row: any) => row._id,
                sortable: true,
            },
            {
                name: "Admin Info",
                cell: (row: Customer) => (
                    <div className='flex items-center space-x-2'>
                        <Image
                            width={100}
                            height={100}
                            src={row?.profilePic || "/icons/avatar.png"}
                            alt='avatar'
                            className='w-10 h-10 rounded-full'
                        />
                        <div>
                            <p className='font-semibold'>
                                {row.fullName || "No Name"}
                            </p>
                            <p className='text-sm whitespace-nowrap text-gray-500'>
                                {row.email.length > 12
                                    ? `${row.email.substring(0, 20)}...`
                                    : row.email}
                            </p>
                        </div>
                    </div>
                ),
                sortable: false,
                grow: 2,
                width: "280px",
            },
            {
                name: "Phone No",
                selector: (row: Customer) => row.phoneNumber || "-",
                sortable: true,
            },
            {
                name: "Age",
                selector: (row: Customer) => row.age || "-",
                sortable: true,
                width: "100px",
            },
            // {
            //     name: "Status",
            //     cell: (row: Customer) => (
            //         <span
            //             className={`px-3 py-1 rounded-full text-sm font-semibold ${
            //                 row.customerStatus === "approved"
            //                     ? "text-green-700 bg-green-100"
            //                     : row.customerStatus === "waiting"
            //                     ? "text-yellow-700 bg-yellow-100"
            //                     : "text-red-700 bg-red-100"
            //             }`}
            //         >
            //             {row.customerStatus}
            //         </span>
            //     ),
            //     sortable: true,
            //     width: "150px",
            // },
            {
                name: "Actions",
                cell: (row: any) => (
                    <TableActions
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onView={handleView}
                        id={row._id}
                    />
                ),
                width: "150px",
            },
        ],
        [handleDelete, handleEdit, handleView]
    );

    const filteredCustomers = React.useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
        return customers.filter(
            (customer) =>
                customer.fullName
                    ?.toLowerCase()
                    .includes(lowerCaseSearchTerm) ||
                customer.email?.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [customers, searchTerm]);

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
                            className='px-4 py-2 Button text-white rounded-md'
                        >
                            Add Admin
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
                    data={filteredCustomers}
                    noDataComponent='No Admins Found'
                    loading={loading}
                />
            </div>

            <CustomModelAdmin
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                title=''
            >
                <ModalNew
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreate}
                />
            </CustomModelAdmin>

            <CustomModelAdmin
                isOpen={isModalEditOpen}
                closeModal={() => setIsModalEditOpen(false)}
                title=''
            >
                <ModalEdit
                    isOpen={isModalEditOpen}
                    onClose={() => setIsModalEditOpen(false)}
                    adminData={currentCustomer}
                    onSubmit={handleUpdate}
                />
            </CustomModelAdmin>

            <CustomModelAdmin
                isOpen={isModalViewOpen}
                closeModal={() => setIsModalViewOpen(false)}
                title=''
            >
                <ModalView
                    isOpen={isModalViewOpen}
                    onClose={() => setIsModalViewOpen(false)}
                    adminData={currentCustomer}
                />
            </CustomModelAdmin>
        </div>
    );
};

export default Admins;
