import React from "react";
import "./TimerBar.css";

interface TimerBarProps {
    duration: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ duration }) => {
    return (
        <div className="timer-bar-wrapper">
            <div
                className="timer-bar"
                style={
                    {
                        "--timer-duration": `${duration}s`,
                    } as React.CSSProperties
                }
            ></div>
        </div>
    );
};

export default React.memo(TimerBar);
