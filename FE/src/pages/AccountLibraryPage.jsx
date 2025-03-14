import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/AccountLibraryPage.scss";

import AccountTabs from "../components/AccountTabs";

const AccountLibraryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const tab = params.get("owner") || "free-read";
    const [activeTab, setActiveTab] = useState(tab);

    useEffect(() => {
        setActiveTab(tab); // Cập nhật activeTab khi URL thay đổi
    }, [tab]);

    const handleTabClick = (type, page, owner) => {
        navigate(`/utebook/account/bookcase?content_type=${type}&page=${page}&owner=${owner}`); // Cập nhật URL khi nhấn tab
    };
    return (
        <div className="library-settings">
            <div className="library-header">
                <div className="tabs">
                    <button
                        onClick={() => handleTabClick('book', 1, 'free-read')}
                        className={`tab ${activeTab === 'free-read' ? 'active' : ''}`}
                    >
                        Đang đọc
                    </button>
                    <button
                        onClick={() => handleTabClick('audio', 1, 'free-listen')}
                        className={`tab ${activeTab === 'free-listen' ? 'active' : ''}`}
                    >
                        Đang nghe
                    </button>
                    <button
                        onClick={() => handleTabClick('book', 1, 'purchase')}
                        className={`tab ${activeTab === 'purchase' ? 'active' : ''}`}
                    >
                        Sách đã mua
                    </button>
                    <button
                        onClick={() => handleTabClick('book', 1, 'wishlist')}
                        className={`tab ${activeTab === 'wishlist' ? 'active' : ''}`}
                    >
                        Yêu thích
                    </button>
                </div>
            </div>
            <div className="library-content">
                {activeTab === 'free-read' &&
                    <AccountTabs
                        itemData={itemData}
                        tabs={tabsFR}
                    />
                }
                {activeTab === 'free-listen' &&
                    <AccountTabs
                        itemData={itemData}
                        tabs={tabsFL}
                    />}
                {activeTab === 'purchase' &&
                    <AccountTabs
                        itemData={itemData}
                        tabs={tabsP}
                    />}
                {activeTab === 'wishlist' &&
                    <AccountTabs
                        itemData={itemData}
                        tabs={tabsW}
                    />}
            </div>
        </div>
    );
};

export default AccountLibraryPage;

const itemData = [
    [
        {
            img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
            title: '[Tóm tắt sách] Bản đồ của trái tim tim tim tim',
            author: '@bkristastucchio',
        },
        {
            img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
            title: 'Burger',
            author: '@rollelflex_graphy726',
        },
        {
            img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
            title: 'Camera',
            author: '@helloimnik',
        },
        {
            img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
            title: 'Coffee',
            author: '@nolanissac',
        },
        {
            img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
            title: 'Hats',
            author: '@hjrc33',
        },
        {
            img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
            title: 'Honey',
            author: '@arwinneil',
        },
        {
            img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
            title: 'Basketball',
            author: '@tjdragotta',
        },
        {
            img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
            title: 'Fern',
            author: '@katie_wasserman',
        },
        {
            img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
            title: 'Mushrooms',
            author: '@silverdalex',
        },
        {
            img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
            title: 'Tomato basil',
            author: '@shelleypauls',
        },
        {
            img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
            title: 'Sea star',
            author: '@peterlaster',
        },
        {
            img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
            title: 'Bike',
            author: '@southside_customs',
        },
    ],
    [],
    [],
    []
];

const tabsFR = [
    { id: "sach-dien-tu", label: "Sách điện tử" },
    { id: "sach-truyen", label: "Sách truyện" },
    { id: "sach-cong-dong", label: "Sách cộng đồng viết" }
];

const tabsFL = [
    { id: "sach-noi", label: "Sách nói" },
];
const tabsP = [
    { id: "sach-dien-tu", label: "Sách điện tử" },
    { id: "sach-noi", label: "Sách nói" },
    { id: "sach-truyen", label: "Sách truyện" },
];
const tabsW = [
    { id: "sach-dien-tu", label: "Sách điện tử" },
    { id: "sach-noi", label: "Sách nói" },
    { id: "sach-truyen", label: "Sách truyện" },
    { id: "sach-cong-dong", label: "Sách cộng đồng viết" }
];