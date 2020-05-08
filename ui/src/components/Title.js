import React from "react";

const Title = (props) => {
    return (
        <React.Fragment>
            <div className="pt-3">
                <h3 className="m-0 d-inline">{props.title}</h3>
                <span className="mx-2">{props.children}</span>
            </div>
            <hr/>
        </React.Fragment>
    )
};

export default Title;