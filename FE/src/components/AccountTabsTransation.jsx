import { useState } from "react";
import PropTypes from 'prop-types';
import "./styles/AccountTabsTransation.scss";
import listTransaction from "./../assets/icon-list-transaction.png";

const AccountTabsTransation = ({ transactions, tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    console.log("AccountTabsTransation props:", { transactions, tabs });
    console.log("Active tab:", activeTab);
    console.log("Current transactions for active tab:", transactions[tabs.findIndex(tab => tab.id === activeTab)]);

    const renderTransactionDetails = (transaction) => {
        return (
            <div className="tabs-details">
                <div className="detail-item">
                    <span className="detail-label">Mã giao dịch:</span>
                    <span className="detail-value">{transaction.details.transactionCode}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Trạng thái:</span>
                    <span className="detail-value">{transaction.details.paymentMethod}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">{transaction.type === 'Nạp' ? '' : ''}</span>
                    <span className="detail-value">{transaction.details.validUntil}</span>
                </div>
            </div>
        );
    };

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
                                {transactions[index]?.length > 0 ? (
                                    <>
                                        <div className="tabs-header">
                                            <div className="header-item">Thời gian</div>
                                            <div className="header-item">Tên gói</div>
                                            <div className="header-item">Giá</div>
                                            <div className="header-item">Nội dung giao dịch</div>
                                        </div>

                                        {transactions[index].map((transaction, idx) => {
                                            console.log("Rendering transaction:", transaction);
                                            return (
                                                <div key={`${transaction.details.transactionCode}-${idx}`} className="tabs-item">
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

                                                    {renderTransactionDetails(transaction)}
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <div className="tab-content">
                                        <div className="no-trans">
                                            <img src={listTransaction} alt="No Transactions" />
                                            <p className="title-trans">Chưa có giao dịch nào</p>
                                            <p className="subtitle-trans">
                                                Cùng khám phá kho tàng tri thức rộng lớn với UTEBOOK
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

AccountTabsTransation.propTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                time: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                additionalInfo: PropTypes.string.isRequired,
                price: PropTypes.string.isRequired,
                details: PropTypes.shape({
                    packageName: PropTypes.string.isRequired,
                    transactionCode: PropTypes.string.isRequired,
                    paymentMethod: PropTypes.string.isRequired,
                    validUntil: PropTypes.string.isRequired
                }).isRequired
            })
        )
    ).isRequired,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    ).isRequired
};

export default AccountTabsTransation;
