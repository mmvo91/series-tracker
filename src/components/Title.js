import React from "react";

const Title = (props) => {
    return (
        <React.Fragment>
            <h3 className="pt-3 m-0">{props.title}</h3>
            <hr/>
        </React.Fragment>
    )
};

export default Title;