import { useState } from "react";

export function useVisualMode(initial) {
    const [pastMode, setPastMode] = useState([initial]);
    const [mode, setMode] = useState(initial);
    return {mode, transition(change, skip) {
        //skips adding transition example error or such from mode history for back function functionality
        if (!skip) setPastMode(prev => [...prev, mode]);
       setMode(change);
    }, back() {
        //sets as past mode, removes past item for history
        setMode(pastMode[pastMode.length-1]);
        setPastMode(prev => prev.slice(0, -1));
    }};
}
