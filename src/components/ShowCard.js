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
    const [rotation, setRotation] = useState(0);

    return (
        <Col md={3} className="py-2">
            <Card>
                <Card.Body>
                    <Card.Title>{props.name}</Card.Title>
                    <div className="text-center py-2">
                        <Image fluid src={props.image}/>
                    </div>
                    <Card.Text>
                        <p><b>Premiere Date: </b>{moment(props.premiered).format('MMMM Do YYYY')}</p>
                        <p>{props.status}</p>
                        <div>
                            <FontAwesomeIcon onClick={() => setCollapse(!open)}
                                             rotation={rotation}
                                             icon="chevron-right"/>
                            {' Summary'}
                        </div>
                        <Collapse in={open}
                                  onEntering={() => setRotation(90)}
                                  onExiting={() => setRotation(0)}>
                            <div className="py-2"
                                 dangerouslySetInnerHTML={{__html: props.summary}}/>
                        </Collapse>
                    </Card.Text>
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