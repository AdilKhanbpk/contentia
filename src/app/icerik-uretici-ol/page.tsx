"use client";

import React, { useState } from "react";
import Beginning from "@/components/Creator/BecomeCreatorBeginning";
import ProfileInformation from "@/components/Creator/BecomeCreatorProfileInformation";
import PaymentInformation from "@/components/Creator/BecomeCreatorPaymentInformation";
import Preferences from "@/components/Creator/BecomeCreatorPreferences";

const BecomeCreator: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 0, label: "Başlangıç" },
        { id: 1, label: "Profil Bilgileri" },
        { id: 2, label: "Ödeme Bilgileri" },
        { id: 3, label: "Tercihler" },
    ];

    return (
        <>
            <div className='sectionBackground pb-4'>
                <div className='flex px-4 sm:px-6 md:px-12 lg:px-20 space-x-8  pt-28'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`w-1/4 pt-2 pb-2 border-t-4 text-sm ${
                                activeTab === tab.id
                                    ? "BlueBorder  BlueText font-bold"
                                    : "pinkBorder text-gray-400"
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 0 && (
                    <Beginning setActiveTab={setActiveTab}></Beginning>
                )}

                {activeTab === 1 && (
                    <ProfileInformation
                        setActiveTab={setActiveTab}
                    ></ProfileInformation>
                )}

                {activeTab === 2 && (
                    <PaymentInformation
                        setActiveTab={setActiveTab}
                    ></PaymentInformation>
                )}

                {activeTab === 3 && (
                    <Preferences setActiveTab={setActiveTab}></Preferences>
                )}
            </div>
        </>
    );
};

export default BecomeCreator;
