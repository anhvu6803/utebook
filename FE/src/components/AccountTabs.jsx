import React, { useState } from "react";
import "./styles/AccountTabs.scss";
import searchResult from "./../assets/icon-search-result.png";

import CustomImageList from "./CustomImageList";
const AccountTabs = ({ itemData, tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className="tabs-container">
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {tabs.map((tab, index) => (
                    <div key={tab.id}>
                        {activeTab === tab.id && <CustomImageList itemData={itemData[index]} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AccountTabs;
