import React, { useState } from "react";
import "./styles/AccountTabsTransation.scss";
import listTransaction from "./../assets/icon-list-transaction.png";


const AccountTabsTransation = ({ transactions, tabs }) => {

    const [activeTab, setActiveTab] = useState(tabs[0].id);
    console.log(transactions[0].time);
    return (
        <div className="tabs-history-container">
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
            <div>
                {tabs.map((tab, index) => (
                    <div key={tab.id}>
                        {activeTab === tab.id &&
                            <>
                                {transactions[index].length > 0 ?
                                    (
                                        <>
                                            <div className="tabs-header">
                                                <div className="header-item">Thời gian</div>
                                                <div className="header-item">Tên gói</div>
                                                <div className="header-item">Giá</div>
                                                <div className="header-item">Nội dung giao dịch</div>
                                            </div>

                                            {transactions[index].map((transaction) =>
                                                <>
                                                    <div className="tabs-item">
                                                        <div className="tabs-time">
                                                            <div>{transaction.time}</div>
                                                            <div>{transaction.date}</div>
                                                        </div>

                                                        <div className="tabs-name">
                                                            <div>{transaction.name}</div>
                                                            <div className="additional-info">{transaction.additionalInfo}</div>
                                                        </div>

                                                        <div className="tabs-price">
                                                            {transaction.price}
                                                        </div>

                                                        <div className="tabs-details">
                                                            <div>{transaction.details.packageName}</div>
                                                            <div>{transaction.details.transactionCode}</div>
                                                            <div>{transaction.details.paymentMethod}</div>
                                                            <div>{transaction.details.validUntil}</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) :
                                    (
                                        <div className="tab-content">
                                            <div className="no-trans">
                                                <img src={listTransaction} alt="No Transactions" />
                                                <p className="title-trans">Chưa có giao dịch nào</p>
                                                <p className="subtitle-trans">
                                                    Cùng khám phá kho tàng tri thức rộng lớn với UTEBOOK
                                                </p>
                                            </div>
                                        </div>
                                    )
                                }

                            </>
                        }
                    </div>
                ))}
            </div>

        </div>
    );
};

export default AccountTabsTransation;
