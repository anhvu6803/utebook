import React from "react";
import "./styles/SupportForm.scss";
import messenger from "../assets/icon-facebook-messenger.png";
import zalo from "../assets/icon-zalo.png";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { Modal } from "@mui/material";
const SupportForm = ({ isHeader = false, showForm, handleShowForm, setOpenMenu }) => {

    return (
        <>
            {isHeader ?
                (
                    <a
                        onClick={() => { handleShowForm(true), setOpenMenu(false) }}
                        style={{ cursor: "pointer" }}
                    >
                        Hỗ trợ
                    </a>
                ) :
                (
                    <li onClick={() => { handleShowForm(true), setOpenMenu(false) }}>
                        <HeadphonesIcon className="icon-create" />
                        Hỗ trợ khách hàng
                    </li>
                )}
            <Modal open={showForm}
                onClose={() => handleShowForm(false)}
            >
                <div className="support-form-container">

                    <div className={`support-form ${showForm ? "show" : ""}`}>
                        <h2>Bạn cần hỗ trợ</h2>
                        <p>Liên hệ với chúng tôi thông qua các kênh hỗ trợ</p>
                        <HighlightOffIcon className="close-icon" onClick={() => handleShowForm(false)} />
                        <div className="support-form-content">
                            <ul className="support-direction">
                                <li
                                    onClick={() => { window.open("https://m.me/nguyentran3024") }}
                                >
                                    <img src={messenger} alt="messenger" />
                                    <span className="text-sd">Messenger</span>
                                </li>
                                <li
                                    onClick={() => { window.open("https://zalo.me/+84342380803") }}
                                >
                                    <img src={zalo} alt="zalo" />
                                    <span className="text-sd">Zalo</span>
                                </li>
                            </ul>
                            <span className="other-way-title">Hoặc</span>
                            <ul className="support-other-way">
                                <li>
                                    <PhoneOutlinedIcon />
                                    <span className="text-sd">Hotline 0342380803</span>
                                </li>

                                <li
                                    onClick={() => { window.open("mailto:nguyentn0308@gmail.com") }}
                                >
                                    <EmailOutlinedIcon />
                                    <span className="text-sd">Email nguyentn0308@gmail.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SupportForm;
