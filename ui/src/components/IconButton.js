import React from "react";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const IconButton = (props) => {
    return (
        <Button
            onClick={props.update}
            key={props.id}
            id={props.id}
            value={props.value}
            variant={props.bg}>
            <FontAwesomeIcon icon={props.icon}
                             className={props.color}
                             size={props.size}/>
            <br/>
            <small>{props.text}</small>
        </Button>
    )
};

IconButton.defaultProps = {
    bg: 'white',
    color: 'text-muted',
    size: 'glyphicon'
};

export default IconButton;