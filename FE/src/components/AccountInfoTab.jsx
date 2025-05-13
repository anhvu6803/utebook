import React, { useState, useEffect } from "react";
import "./styles/AccountInfoTab.scss";
import axios from 'axios';

import CustomAlert from "./CustomAlert";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const defaultAvatar = 'https://res.cloudinary.com/dbmynlh3f/image/upload/v1744354478/cciryt3jpun1dys5rz8s.png';
const AccountInfoTab = ({ userData }) => {
    const username = userData.username;
    const userId = userData._id;
    
    const [fullName, setFullName] = useState(userData.fullname);
    const [dob, setDob] = useState(userData.ngaySinh ?
        new Date(userData.ngaySinh).toISOString().split('T')[0] :
        ''
    );
    const [gender, setGender] = useState(userData.gioiTinh);
    const [profilePicture, setProfilePicture] = useState(userData?.avatar || defaultAvatar);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [hasChanges, setHasChanges] = useState(false);
    const [changedFields, setChangedFields] = useState({});
    const [isFocusFullName, setFocusFullName] = useState(false);

    // Kiểm tra thay đổi
    useEffect(() => {
        const changes = {
            fullname: fullName !== userData.fullname,
            ngaySinh: dob !== (userData.ngaySinh ? new Date(userData.ngaySinh).toISOString().split('T')[0] : ''),
            gender: gender !== userData.gioiTinh,
            avatar: selectedFile !== null
        };

        setChangedFields(changes);
        setHasChanges(Object.values(changes).some(change => change));
    }, [fullName, dob, gender, selectedFile, userData]);

    const handleFullNameChange = (e) => {
        setFullName(e.target.value);
    };

    const handleDobChange = (e) => {
        setDob(e.target.value);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.size > MAX_FILE_SIZE) {
            setAlert({
                open: true,
                message: 'Tệp quá lớn, kích thước tối đa là 5MB.',
                severity: 'error'
            });
            return;
        }
    
        if (file) {
            setSelectedFile(file);
    
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };    

    const handleUploadImage = async () => {
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const responseImage = await axios.post(
                'http://localhost:5000/api/cloudinary/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (responseImage.data.success) {
                setProfilePicture(responseImage.data.data.url);
            }
        } catch (error) {
            setAlert({
                open: true,
                message: 'Có lỗi khi đăng ảnh đại diện',
                severity: 'error'
            });
            setIsLoading(false);
            return;
        }
    };

    const handleUpdateInfor = async () => {
        try {
            const response = await axios.patch(
                `http://localhost:5000/api/user/${userId}`,
                {
                    fullname: fullName,
                    ngaySinh: dob,
                    gioiTinh: gender,
                    avatar: profilePicture
                }
            );

            if (response.data.success) {
                setSelectedFile(null);
            }
        }
        catch (error) {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin cá nhân',
                severity: 'error'
            });
            setIsLoading(false);
            return;
        }
    }

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            setAlert({ ...alert, open: false });

            await handleUploadImage().
                then(
                    await handleUpdateInfor()
                );

        } catch (error) {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin',
                severity: 'error'
            });
            setIsLoading(false);
            return;
        } finally {
            setIsLoading(false);
            setAlert({
                open: true,
                message: 'Cập nhật thông tin thành công!',
                severity: 'success'
            });
        }
    };

    const handleCancel = () => {
        setFullName(userData.fullname);
        setDob(userData.ngaySinh ?
            new Date(userData.ngaySinh).toISOString().split('T')[0] :
            ''
        );
        setGender(userData.gioiTinh);
        setProfilePicture(userData.avatar);
        setSelectedFile(null);
        setAlert({ ...alert, open: false });
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <div className="profile-info">
            <div className="form">
                <div className="input-group">
                    <div class="input-container">
                        <label for="username">Tên đăng nhập</label>
                        <input type="text" id="username" value={username} disabled />
                    </div>

                    <div class="input-container">
                        <label for="userid">ID người dùng</label>
                        <input type="text" id="userid" value={userId} disabled />
                    </div>
                    <div>
                        <div class="input-container-outline">
                            <label for="fullname">Họ và tên</label>
                            <input
                                type="text"
                                id="fullname"
                                value={fullName}
                                onChange={handleFullNameChange}
                                onFocus={() => { setFocusFullName(true) }}
                                onBlur={() => { setFocusFullName(false) }}
                                className={changedFields.fullname ? 'changed' : ''}
                            />
                        </div>
                        {isFocusFullName &&
                            <span style={{
                                color: "#ccc",
                                fontSize: "13px",
                            }}>
                                Họ và tên có độ dài từ 1 - 55 ký tự
                            </span>
                        }
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                        <div className="input-container-outline" style={{ width: "240px" }}>
                            <label> Ngày sinh </label>
                            <input
                                type="date"
                                value={dob}
                                onChange={handleDobChange}
                                placeholder="dd/mm/yyyy"
                                className={changedFields.ngaySinh ? 'changed' : ''}
                            />
                        </div>

                        <div className="select-container" style={{ width: "240px" }}>
                            <label> Giới tính </label>
                            <select
                                value={gender}
                                onChange={handleGenderChange}
                                className={changedFields.gender ? 'changed' : ''}
                            >
                                <option value="Khác">Khác</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button
                        className="btn update"
                        onClick={handleUpdate}
                        disabled={isLoading || !hasChanges}
                    >
                        {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                    <button
                        className="btn cancel"
                        onClick={handleCancel}
                        disabled={isLoading || !hasChanges}
                    >
                        Hủy
                    </button>
                </div>
            </div>

            <div className="profile-picture">
                <img
                    src={profilePicture || testAvatar}
                    alt="Profile"
                    className="image"
                />
                <div class="upload-btn-wrapper">
                    <button>Thay ảnh</button>
                    <input type="file" name="myfile" onChange={handleImageChange} />
                </div>
            </div>

            <CustomAlert alert={alert} handleCloseAlert={handleCloseAlert} />
        </div>
    );
};

export default AccountInfoTab;