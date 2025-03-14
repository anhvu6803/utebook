import React, { useState } from "react";
import "./styles/AccountAddressTab.scss";

import emptyAddress from "../assets/emptyAddress.png";
import AddressUpdateForm from "./AddressUpdateForm";
import AddressTable from "./AddressTable";

const addresses = [
    {
        name: 'Anhvu',
        phone: '0342380803',
        address: 'Ho Chi Minh Phường Hiệp Phú Thành Phố Thủ Đức Hồ Chí Minh',
        type: 'Nhà riêng',
        isDefault: false,
    },
    {
        name: 'Anhvu',
        phone: '0342380803',
        address: 'Ho Chi Minh Phường 14 Quận Tân Bình Hồ Chí Minh',
        type: 'Văn phòng',
        isDefault: false,
    },
    {
        name: 'Anhvu',
        phone: '0342380803',
        address: 'Ho Chi Minh Phường Hòa Thọ Tây Quận Cẩm Lệ Đà Nẵng',
        type: 'Văn phòng',
        isDefault: true,
    },
];

const AccountAddressTab = () => {
    const [addressesTable, setaddressesTable] = useState(addresses);

    const toggleDefault = (index) => {
        const newaddressesTable = addressesTable.map((address, i) => ({
            ...address,
            isDefault: i === index, // Chỉ đặt isDefault = true cho địa chỉ được chọn
        }));
        setaddressesTable(newaddressesTable);
    };

    const deleteAddress = (index) => {
        const newaddressesTable = addressesTable.filter((_, i) => i !== index);
        setaddressesTable(newaddressesTable);
    };
    return (
        <div className="address-container">
            {addressesTable.length > 0 ?
                (
                    <div className="address-content">
                        <div className="btn-create-address">

                            <AddressUpdateForm />
                        </div>
                        <AddressTable
                            addresses={addresses}
                            toggleDefault={toggleDefault}
                            deleteAddress={deleteAddress}
                        />
                    </div>
                )
                :
                (
                    <div className="address-content">

                        <img src={emptyAddress} alt="emptyAddress" className="img-empty" />
                        <h2>Bạn chưa có địa chỉ</h2>
                        <p>Hãy tạo địa chỉ để đặt hàng bạn nhé!</p>

                        <AddressUpdateForm />
                    </div>
                )
            }

        </div>
    );
};

export default AccountAddressTab;