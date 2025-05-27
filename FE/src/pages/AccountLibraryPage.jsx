import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./styles/AccountLibraryPage.scss";

import AccountTabs from "../components/AccountTabs";

const AccountLibraryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const params = new URLSearchParams(location.search);
    const tab = params.get("owner") || "reading";
    const [activeTab, setActiveTab] = useState(tab);

    const [type, setType] = useState('member');
    const [owner, setOwner] = useState('reading');

    const [listHistoryReading, setListHistoryReading] = useState({
        member: [],
        hoaPhuong: [],
        free: [],
    });

    const [ListFavoriteBook, setListFavoriteBook] = useState({
        member: [],
        hoaPhuong: [],
        free: [],
    });

    const getListHistoryReading = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/history-readings/user/${user._id}`);

            if (res.data.success) {
                setListHistoryReading({
                    member: res.data.member.map((item) => item.book),
                    hoaPhuong: res.data.hoaPhuong.map((item) => item.book),
                    free: res.data.free.map((item) => item.book),
                });
            }
            console.log(res.data);
        }
        catch (err) {
            console.log(err);
        }
    };
    const getListFavoriteBook = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/user/list-favorite/${user._id}`);
            if (res.data.success) {
                setListFavoriteBook({
                    member: res.data.member.map((item) => item.book),
                    hoaPhuong: res.data.hoaPhuong.map((item) => item.book),
                    free: res.data.free.map((item) => item.book),
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getListHistoryReading();
                await getListFavoriteBook();
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setActiveTab(tab); // Cập nhật activeTab khi URL thay đổi
    }, [tab]);

    const handleTabClick = (type, value, owner) => {
        setType(type);
        setOwner(owner);
        navigate(`/utebook/account/bookcase?content_type=${type}&page=${value}&owner=${owner}`); // Cập nhật URL khi nhấn tab
    };
    return (
        <div className="library-settings">
            <div className="library-header">
                <div className="tabs">
                    <button
                        onClick={() => handleTabClick(type, 1, 'reading')}
                        className={`tab ${activeTab === 'reading' ? 'active' : ''}`}
                    >
                        Đang đọc
                    </button>
                    <button
                        onClick={() => handleTabClick(type, 1, 'wishlist')}
                        className={`tab ${activeTab === 'wishlist' ? 'active' : ''}`}
                    >
                        Yêu thích
                    </button>
                </div>
            </div>
            <div className="library-content">
                {activeTab === 'reading' &&
                    <AccountTabs
                        itemData={listHistoryReading}
                        type={type}
                        setType={setType}
                        owner={owner}
                        tabs={tabs}
                    />
                }

                {activeTab === 'wishlist' &&
                    <AccountTabs
                        itemData={ListFavoriteBook}
                        type={type}
                        setType={setType}
                        owner={owner}
                        tabs={tabs}
                    />
                }
            </div>
        </div>
    );
};

export default AccountLibraryPage;

const tabs = [
    { id: "member", label: "Sách hội viên" },
    { id: "hoaPhuong", label: "Sách hoa phượng" },
    { id: "free", label: "Sách miễn phí" }
];

