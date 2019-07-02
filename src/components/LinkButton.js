import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import Button from "react-bootstrap/Button";

const LinkButton = (props) => {
    return (
        <LinkContainer to={props.to}>
            <Button>
                {props.text}
            </Button>
        </LinkContainer>
    )
};

export default LinkButton;