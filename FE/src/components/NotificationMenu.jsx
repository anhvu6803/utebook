import React, { useState, useEffect } from "react";
import "./styles/NotificationMenu.scss"; // Import SCSS
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

import NotificationsIcon from '@mui/icons-material/Notifications';
import DiscountIcon from '@mui/icons-material/Discount';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import NoNotification from '../assets/bad.png';

function calculateDaysFrom(mongoDate) {

    const givenDate = new Date(mongoDate);

    const currentDate = new Date();

    const timeDifference = currentDate - givenDate;

    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const weekDifference = Math.floor(dayDifference / 7);

    return dayDifference === 0 ? 'Hôm nay' : (weekDifference < 1 ? dayDifference + ' ngày' : weekDifference + ' tuần');
}


const NotificationMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/notification/${user._id}`);
                console.log(response.data.data);
                setNotifications(response.data.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="notification-container"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="notification-icon" >
                <NotificationsIcon style={{ fontSize: 30 }} />
            </div>

            <div className={`notification-dropdown ${isOpen ? "active" : ""}`}>
                <div className="menu-header">
                    <span>Thông báo</span>
                </div>

                <div className="notification-list">
                    {notifications.length === 0 ?
                        (
                            <img
                                src={NoNotification}
                                style={{
                                    width: 250,
                                    height: 250,
                                    display: "flex",
                                    marginTop: 50,
                                    alignItems: "center",
                                    border: 'none'
                                }}
                            />
                        )
                        :
                        (
                            <>
                                {notifications.map((item) => (
                                    <div key={item.id} className="notification-item">
                                        {item.type === 'coupon' && <DiscountIcon className="icon" />}
                                        {item.type === 'info' && <InfoIcon className="icon" />}
                                        {item.type === 'warning' && <WarningIcon className="icon" />}
                                        {item.type === 'error' && <ErrorIcon className="icon" />}
                                        
                                        <div className="content">
                                            <span className="time">{calculateDaysFrom(item.createdAt)}</span>
                                            <span className="title">{item.title}</span>
                                            <div className="description ellipsis">{item.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )
                    }
                </div>
            </div>
        </div >
    );
};

export default NotificationMenu;
