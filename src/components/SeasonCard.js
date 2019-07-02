import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import LinkButton from "./LinkButton";

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

                    <ButtonGroup>
                        <LinkButton to={"/shows/" + props.show_id + "/season/" + props.number} text="Episodes"/>
                        {
                            props.watched
                                ? <Button onClick={props.update} key={props.number} id={props.number} variant="danger">Mark
                                    Not
                                    Watched</Button>
                                : <Button onClick={props.update} key={props.number} id={props.number}>Mark
                                    Watched</Button>
                        }
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </Col>
    )

};

export default Season