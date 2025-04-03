import React from 'react';
import { Select } from 'antd';
const CustomSelect_Category = ({ options, handleChange, selectedValue, style, size }) => {
    return (
        < Select
            showSearch
            style={style}
            placeholder="Chọn thể loại"
            optionFilterProp="label"
            options={options}
            onChange={handleChange}
            value={selectedValue}
            size={size}
        />
    )
};
export default CustomSelect_Category;