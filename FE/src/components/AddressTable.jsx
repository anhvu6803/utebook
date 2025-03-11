import React, { useState } from 'react';
import './styles/AddressTable.scss';

import AddressUpdateForm from './AddressUpdateForm';

const AddressTable = ({ addresses = [], toggleDefault, deleteAddress }) => {

  return (
    <div className="address-table">
      <table className="address-table__list">
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Loại địa chỉ</th>
            <th>Thiết lập mặc định</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address, index) => (
            <tr key={index}>
              <td>{address.name}</td>
              <td>{address.phone}</td>
              <td>{address.address}</td>
              <td>{address.type}</td>
              <td>
                <div
                  className={`toggle ${address.isDefault ? 'active' : ''}`}
                  onClick={() => toggleDefault(index)}
                >
                  <span className="toggle__circle" />
                </div>
                <span>Mặc định</span>
              </td>
              <td>
                <AddressUpdateForm isNewAddress={false} />
                <button
                  className={`btn-delete ${address.isDefault ? 'disabled' : ''}`}
                  onClick={() => !address.isDefault && deleteAddress(index)}
                  disabled={address.isDefault}
                >
                  Xóa địa chỉ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddressTable;