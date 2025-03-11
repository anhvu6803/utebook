import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/AddressUpdateForm.scss";
import "./styles/AddressTable.scss";

import CustomSelect from "./CustomSelect";
import CustomSelect_Nosearch from "./CustomSelect_Nosearch";
import CustomSwitch from "./CustomSwitch";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

const typeAddress = ['Nhà riêng', 'Văn phòng'];

const AddressUpdateForm = ({ isNewAddress = true }) => {
    const [showForm, setShowForm] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [selectAddressType, setAddressType] = useState("");

    // Gọi API lấy danh sách tỉnh/thành phố
    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/?depth=1").then((res) => {
            setProvinces(res.data);
        });
    }, []);

    // Khi chọn tỉnh/thành phố, lấy danh sách quận/huyện
    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        setSelectedProvince(provinceCode);
        setSelectedDistrict(""); // Reset quận/huyện khi chọn tỉnh mới
        setSelectedWard(""); // Reset phường/xã
        console.log(selectedProvince);
        console.log(provinceCode);
        axios
            .get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
            .then((res) => {
                setDistricts(res.data.districts);
            });


    };

    // Khi chọn quận/huyện, lấy danh sách phường/xã
    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        setSelectedDistrict(districtCode);
        setSelectedWard(""); // Reset phường/xã khi chọn quận mới

        axios
            .get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
            .then((res) => {
                setWards(res.data.wards);
            });
    };

    const handleAddressTypeChange = (e) => {
        setAddressType(e.target.value);
    };
    
    return (
        <div className="address-form-container">

            {showForm && <div className="backdrop" />}

            <button className={isNewAddress ? "create-address-btn" : "btn-update"}
                onClick={() => setShowForm(true)}
            >
                {isNewAddress && <AddIcon className="icon-create" />}
                {isNewAddress ? "Tạo địa chỉ" : "Cập nhật"}
            </button>
            <div className={`address-form ${showForm ? "show" : ""}`}>
                <h2>Thêm địa chỉ nhận hàng</h2>
                <p>Vui lòng nhập đầy đủ các trường thông tin bắt buộc!</p>
                <HighlightOffIcon className="close-icon" onClick={() => setShowForm(false)} />
                <form >
                    <div className="form-group">
                        <TextField
                            sx={{
                                width: '260px',
                                background: '#e8f0fe',
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#005bbb", // Màu viền cố định
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#005bbb", // Khi hover vẫn giữ màu này
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#005bbb", // Khi focus vẫn giữ màu này
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#999999", // Màu mặc định
                                    "&.Mui-focused": {
                                        color: "#005bbb", // Khi focus đổi màu
                                    }
                                }
                            }}
                            id="fullName"
                            label=
                            {<>
                                <span>Họ và tên </span>
                                <span style={{ color: "#ff375f" }}>*</span>
                            </>}
                            variant="outlined"
                        />
                        <TextField
                            sx={{
                                width: '260px',
                                background: '#e8f0fe',
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#005bbb", // Màu viền cố định
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#005bbb", // Khi hover vẫn giữ màu này
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#005bbb", // Khi focus vẫn giữ màu này
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#999999", // Màu mặc định
                                    "&.Mui-focused": {
                                        color: "#005bbb", // Khi focus đổi màu
                                    }
                                }
                            }}
                            id="phoneNumber"
                            label=
                            {<>
                                <span>Số điện thoại </span>
                                <span style={{ color: "#ff375f" }}>*</span>
                            </>}
                            variant="outlined"
                        />
                        <TextField
                            sx={{
                                width: '260px',
                                background: '#e8f0fe',
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#005bbb", // Màu viền cố định
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#005bbb", // Khi hover vẫn giữ màu này
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#005bbb", // Khi focus vẫn giữ màu này
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#999999", // Màu mặc định
                                    "&.Mui-focused": {
                                        color: "#005bbb", // Khi focus đổi màu
                                    }
                                }
                            }}
                            id="email"
                            label="Email"
                            variant="outlined"
                        />
                    </div>

                    <div className="form-group">
                        <CustomSelect
                            options={provinces}
                            selectedValue={selectedProvince}
                            handleChange={handleProvinceChange}
                            placeholder="Tỉnh/Thành phố"
                            width={'260px'}
                        />

                        <CustomSelect
                            options={districts}
                            selectedValue={selectedDistrict}
                            handleChange={handleDistrictChange}
                            placeholder="Quận/Huyện"
                            width={'260px'}
                        />

                        <CustomSelect
                            options={wards}
                            selectedValue={selectedWard}
                            handleChange={(e) => setSelectedWard(e.target.value)}
                            placeholder="Phường/Xã"
                            width={'260px'}
                        />
                    </div>
                    <div className="form-group">
                        <TextField
                            sx={{
                                width: '845px',
                                background: '#e8f0fe',
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#005bbb", // Màu viền cố định
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#005bbb", // Khi hover vẫn giữ màu này
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#005bbb", // Khi focus vẫn giữ màu này
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#999999", // Màu mặc định
                                    "&.Mui-focused": {
                                        color: "#005bbb", // Khi focus đổi màu
                                    }
                                }
                            }}
                            id="detailAddress"
                            label=
                            {<>
                                <span style={{ color: "#999999" }}>Địa chỉ chi tiết </span>
                                <span style={{ color: "#ff375f" }}>*</span>
                            </>}
                            variant="outlined"
                        />
                    </div>
                    <div className="form-group">
                        <CustomSelect_Nosearch
                            options={typeAddress}
                            selectedValue={selectAddressType}
                            handleChange={handleAddressTypeChange}
                            placeholder="Loại địa chỉ"
                            width={'845px'}
                        />
                    </div>

                    <div className="form-group">
                        <TextField
                            sx={{
                                width: '845px',
                                background: '#e8f0fe',
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#005bbb", // Màu viền cố định
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#005bbb", // Khi hover vẫn giữ màu này
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#005bbb", // Khi focus vẫn giữ màu này
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#999999", // Màu mặc định
                                    "&.Mui-focused": {
                                        color: "#005bbb", // Khi focus đổi màu
                                    }
                                }
                            }}
                            id="Note"
                            label=
                            {<>
                                <span style={{ color: "#999999" }}>Ghi chú </span>
                            </>}
                            variant="outlined"
                        />
                    </div>

                    <div className="form-group switch">
                        <CustomSwitch />
                    </div>

                    <button type="submit">Cập nhật</button>
                </form>
            </div>
        </div>
    );
};

export default AddressUpdateForm;
