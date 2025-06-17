import { useEffect, useState } from "react";
import {
    Clock1, Clock2, Clock3,
    Clock4, Clock5, Clock6,
    Clock7, Clock8, Clock9,
    Clock10, Clock11, Clock12
} from "lucide-react";

const ClockIcons = [
    Clock12, Clock1, Clock2, Clock3,
    Clock4, Clock5, Clock6,
    Clock7, Clock8, Clock9,
    Clock10, Clock11,
];

export default function LoadingClockAnimation({ isLoading }) {
    const [activeClock, setActiveClock] = useState(0);

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setActiveClock((prev) => (prev + 1) % 12);
        }, 150); // 150ms mỗi lần thay đổi icon

        return () => clearInterval(interval);
    }, [isLoading]);

    const ActiveClockIcon = ClockIcons[activeClock];

    return (
        <div className="flex items-center justify-center h-20 w-20">
            {isLoading && <ActiveClockIcon size={24} className="animate-pulse text-blue-500" />}
        </div>
    );
}
