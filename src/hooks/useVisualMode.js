import { useState } from "react";

export function useVisualMode(initial) {
    const [pastMode, setPastMode] = useState([initial]);
    const [mode, setMode] = useState(initial);
    return {mode, transition(change, skip) {
        if (!skip) setPastMode(prev => [...prev, mode]);
       setMode(change);
    }, back() {
        setMode(pastMode[pastMode.length-1]);
        setPastMode(prev => prev.slice(0, -1));
    }};
}
