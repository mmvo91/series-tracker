import React, {useState} from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import moment from "moment"
import Collapse from "react-bootstrap/Collapse";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LinkIconButton from "../components/LinkIconButton";
import IconButton from "./IconButton";

const Show = (props) => {
    const [open, setCollapse] = useState(false);
    const [rotation, setRotation] = useState(null);

    return (
        <Col md={4} lg={3} className="py-2">
            <Card>
                <Card.Body>
                    <Card.Title>{props.name}</Card.Title>
                    <Image fluid src={props.image} className="mx-auto d-block my-3"/>
                    <div className="card-text">
                        <p><b>Premiere Date: </b>{moment.utc(props.premiered).format('MMMM Do YYYY')}</p>
                        <p>{props.status}</p>
                        <div>
                            <FontAwesomeIcon onClick={() => setCollapse(!open)}
                                             rotation={rotation}
                                             icon="chevron-right"/>
                            {' Summary'}
                        </div>
                        <Collapse in={open}
                                  onEntering={() => setRotation(90)}
                                  onExiting={() => setRotation(null)}>
                            <div className="py-2"
                                 dangerouslySetInnerHTML={{__html: props.summary}}/>
                        </Collapse>
                    </div>
                    <div className="text-center">
                        <LinkIconButton
                            to={"/shows/" + props.id + "/season"}
                            text="Seasons"
                            icon="expand"
                            color="text-primary"/>
                        {
                            props.watched
                                ? <IconButton
                                    update={props.update}
                                    id={props.id}
                                    icon="check"
                                    color="text-success"
                                    text="Watched"/>
                                : <IconButton
                                    update={props.update}
                                    id={props.id}
                                    icon="check"
                                    text="Not Watched"/>
                        }
                        <Button onClick={props.delete}
                                key={props.id}
                                id={props.id}
                                variant="white">
                            <FontAwesomeIcon icon="minus"
                                             className="text-danger"
                                             size="lg"/>
                            <br/>
                            <small>Unsubscribe</small>
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )

};

export default Show