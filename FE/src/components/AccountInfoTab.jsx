import React, { useState } from "react";
import "./styles/AccountInfoTab.scss";
import testAvatar from "../assets/testAvatar.jpg";

const AccountInfoTab = () => {
    const [username, setUsername] = useState("wasabi.together");
    const [userId, setUserId] = useState("9654463");
    const [fullName, setFullName] = useState("Anh Vu");
    const [dob, setDob] = useState("01/01/1900");
    const [gender, setGender] = useState("Khác");
    const [profilePicture, setProfilePicture] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
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

                    <div class="input-container-outline">
                        <label for="fullname">Họ và tên</label>
                        <input type="text" id="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                        <div className="input-container-outline" style={{ width: "240px" }}>
                            <label> Ngày sinh </label>
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}

                            />
                        </div>

                        <div className="select-container" style={{ width: "240px" }}>
                            <label> Giới tính </label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="Khác">Khác</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button className="btn update">Cập nhật</button>
                    <button className="btn cancel">Hủy</button>
                </div>
            </div>


            <div className="profile-picture">
                <img
                    src={profilePicture || testAvatar}
                    alt="Profile"
                    className="image"
                />
                <div class="upload-btn-wrapper">
                    <button class="btn">Thay ảnh</button>
                    <input type="file" name="myfile" onChange={handleImageChange} />
                </div>
            </div>
        </div>
    );
};

export default AccountInfoTab;