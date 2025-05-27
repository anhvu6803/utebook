import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';

import "./styles/AccountTabs.scss";
import axios from "../utils/axios";

import CustomLibraryList from "./CustomLibraryList";
import PaginationButtons from "../components/PaginationButtons";

const splitIntoGroups = (inputList, chunkSize) => {
    const result = [];
    for (let i = 0; i < inputList.length; i += chunkSize) {
        result.push(inputList.slice(i, i + chunkSize));
    }
    return result;
}

const AccountTabs = ({
    itemData,
    type,
    setType,
    owner,
    tabs }) => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [allBooks, setAllBooks] = useState([]);
    const [typeTab, setTypeTab] = useState(type);
    const [isLoading, setIsLoading] = useState(true);

    const page = parseInt(searchParams?.get('page') || 1, 10);
    console.log(itemData);
    useEffect(() => {
        const getAllBooksbyType = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(
                    `http://localhost:5000/api/book/books/type/member`,
                );
                setAllBooks(res.data.data);
            } catch (err) {
                setIsLoading(false);
            }
            finally {
                setIsLoading(false);
            }
        }
        getAllBooksbyType();
    }, [])
    const handlePageChange = (event, value) => {
        const currentPath = location.pathname;
        if (owner)
            navigate(`${currentPath}?content_type=${typeTab}&page=${value}&owner=${owner}`);
        else
            navigate(`${currentPath}?content_type=${typeTab}&page=${value}`);
    };

    const handleChangeTab = (value) => {
        const currentPath = location.pathname;
        setType(value);
        setTypeTab(value);
        setActiveTab(value);
        if (owner)
            navigate(`${currentPath}?content_type=${value}&page=1&owner=${owner}`);
        else
            navigate(`${currentPath}?content_type=${value}&page=1`);
    }
    const handleViewDetail = (tab, id) => {
        if(tab === 'member'){
            navigate(`/utebook/sach-hoi-vien/view/${id}`);
        }
        else{
            navigate(`/utebook/novel/view/${id}`);
        }
    }
    return (
        <div className="tabs-container">
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => handleChangeTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {tabs.map((tab, index) => (
                    <div key={tab.id}>
                        {activeTab === tab.id &&
                            <>
                                <CustomLibraryList
                                    itemData={splitIntoGroups(itemData[tab.id], 20)}
                                    page={page}
                                    tab={tab.id}
                                    handleViewDetail={handleViewDetail}
                                />
                                {itemData[tab.id].length > 0 &&

                                    <PaginationButtons
                                        count={Math.ceil(itemData[tab.id].length / 30)}
                                        page={page}
                                        handlePageChange={handlePageChange}
                                    />
                                }
                            </>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AccountTabs;
