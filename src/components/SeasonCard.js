import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import LinkIconButton from "./LinkIconButton";
import IconButton from "./IconButton";

const Season = (props) => {
    return (
        <Col md={3} className="py-2">
            <Card>
                <Card.Body>
                    <Card.Title>
                        {
                            props.name
                                ? props.name
                                : "Season " + props.number
                        }
                    </Card.Title>

                    <Image fluid src={props.image}/>

                    <div className="text-center">
                        <LinkIconButton to={"/shows/" + props.show_id + "/season/" + props.number}
                                        text="Episodes"
                                        icon="expand"
                                        color="text-primary"/>
                        {
                            props.watched
                                ? <IconButton
                                    update={props.update}
                                    id={props.number}
                                    icon="check"
                                    color="text-success"
                                    text="Watched"/>
                                : <IconButton
                                    update={props.update}
                                    id={props.number}
                                    icon="check"
                                    text="Not Watched"/>
                        }
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )

};

export default Season