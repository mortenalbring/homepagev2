import {useEffect, useState} from 'react';

/*
Shows the little 'clock' in the Taskbar
 */
export function useClock(): Date {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return currentTime;
}
