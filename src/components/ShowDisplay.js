import React from "react";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col"

const ShowDisplay = (props) => {
    return (
        <Alert variant="dark">
            <Alert.Heading>
                {props.name}
            </Alert.Heading>
            <hr/>
            <div className="row d-flex align-content-center w-75 mx-auto">
                <Col sm={12} md={6}>
                    <Image fluid src={props.image} className="d-flex mx-auto"/>
                </Col>
                <Col sm={12} md={6} className="py-2 py-sm-2 py-md-0">
                    <div dangerouslySetInnerHTML={{__html: props.summary}}/>
                </Col>
            </div>
        </Alert>
    )

};

export default ShowDisplay