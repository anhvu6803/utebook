import React from "react";
import "./styles/ProgressBarMini.scss";

const steps = [
    {
        label: 'Đặt hàng',
        labelCompleted: 'Đặt hàng thành công',
        subLabel: '09:17 19/03/2025',
        status: 'completed'
    },
    {
        label: 'Xác nhận đơn hàng',
        labelCompleted: 'Xác nhận đơn hàng thành công',
        subLabel: '09:17 19/03/2025',
        status: 'completed'
    },
    {
        label: 'Vận chuyển',
        labelCompleted: 'Vận chuyển thành công',
        subLabel: '09:17 19/03/2025',
        status: 'completed'
    },
    {
        label: 'Nhận hàng',
        labelCompleted: 'Nhận hàng thành công',
        subLabel: '09:17 19/03/2025',
        status: 'completed'
    },
    {
        label: 'Đánh giá',
        labelCompleted: 'Nhận hàng thành công',
        status: 'pending'
    }
];
const setStastusStep = (currentStepIndex) => {
    const newSteps = steps.map((step, index) => {
        if (index <= currentStepIndex) {
            return { ...step, status: 'completed' };
        } else if (index > currentStepIndex) {
            return { ...step, status: 'pending' };
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
const ProgressBarMini = ({ statusOrder }) => {

    const stepCompleted = setStastusStep(setStastusIndex(statusOrder)).filter(step => step.status === 'completed');
    return (
        <div className="order-tracker-mini">
            {stepCompleted.map((step, index) => (
                <>
                    {step.status === 'completed' &&
                        <div key={index} className={`step ${step.status}`}>
                            <div className="icon-container" />
                            <div className="label-container">
                                {step.subLabel && step.status === 'completed' && <div className="time-label">{step.subLabel}</div>}
                                <div className="label">{step.status === 'completed' ? step.labelCompleted : step.label}</div>
                            </div>
                            {index < stepCompleted.length - 1 && <div className={`connector ${step.status}`} />}
                        </div>
                    }
                </>

            ))}
        </div>
    );
};

export default ProgressBarMini;