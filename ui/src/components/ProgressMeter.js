import React from "react";
import {CircularProgressbar} from 'react-circular-progressbar';

const ProgressMeter = (props) => {
    return (
        <div className="text-center px-3">
            <CircularProgressbar
                value={Math.round(props.completed / props.available * 100)}
                text={`${Math.round(props.completed / props.available * 100)}%`}
            />
            <p>{props.type}<br/>{'watched'}</p>
        </div>
    )
};

export default ProgressMeter;