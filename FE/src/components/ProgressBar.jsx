import React from "react";
import "./styles/ProgressBar.scss";

import { CheckCircle, FileText, Truck, Package, Star } from 'lucide-react';

const steps = [
    {
        icon: <CheckCircle />,
        label: 'Đặt hàng',
        subLabel: '09:17 19/03/2025',
        status: 'completed'
    },
    {
        icon: <FileText />,
        label: 'Xác nhận đơn hàng',
        subLabel: '09:17 19/03/2025',
        status: 'completed'
    },
    {
        icon: <Truck />,
        label: 'Vận chuyển',
        subLabel: '09:17 19/03/2025',
        status: 'pending'
    },
    {
        icon: <Package />,
        label: 'Nhận hàng',
        subLabel: '09:17 19/03/2025',
        status: 'pending'
    },
    {
        icon: <Star />,
        label: 'Đánh giá',
        status: 'pending'
    }
];
const setStastusStep = (currentStepIndex) => {
    const newSteps = steps.map((step, index) => {
        if (index <= currentStepIndex) {
            return { ...step, status: 'completed' };
        } else if (index > currentStepIndex) {
            return { ...step, status: 'pending' };
        } else {
            return { ...step, status: 'current' };
        }
    });
    return newSteps;
};

const setStastusIndex = (statusOrder) => {
    if (statusOrder === 'need_confirm')
        return 0;
    else if (statusOrder === 'delivering')
        return 1;
    else if (statusOrder === 'delivered')
        return 2;
    else if(statusOrder === 'received')
        return 3;
    else
        return 4;
}

const ProgressBar = ({ statusOrder }) => {
    const stepCompleted = setStastusStep(setStastusIndex(statusOrder));
    return (
        <div className="order-tracker">
            {stepCompleted.map((step, index) => (
                <div key={index} className={`step ${step.status}`}>
                    <div className="icon-container">
                        {step.icon}
                    </div>
                    <div className="label-container">
                        <div className="label">{step.status === 'completed' ? step.label + ' thành công' : step.label}</div>
                        {step.subLabel && step.status === 'completed' && <div className="sub-label">{step.subLabel}</div>}
                    </div>
                    {index < steps.length - 1 && <div className={`connector ${step.status}`} />}
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;