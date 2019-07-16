import React from "react";
import {Link} from "react-router-dom"
import IconButton from "../components/IconButton"

const LinkIconButton = (props) => {
    return (
        <Link to={props.to}>
            <IconButton {...props}/>
        </Link>
    )
};

export default LinkIconButton;