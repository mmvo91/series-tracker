import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import moment from "moment"

const Episode = (props) => {
    return (
        <Col md={3} className="py-2">
            <Card>
                <Card.Body>
                    <Card.Title>{props.name}</Card.Title>
                    <Image fluid src={props.image}/>
                    <p><b>Air Date: </b>{moment(props.air_date).format('MMMM Do YYYY')}</p>
                    <p><b>Season: </b>{props.season} <b>Episode: </b>{props.number}</p>
                    <div dangerouslySetInnerHTML={{__html: props.summary}}/>
                    {
                        props.watched
                            ? <Button onClick={props.update} key={props.id} id={props.id} variant="danger">Mark Not
                                Watched</Button>
                            : <Button onClick={props.update} key={props.id} id={props.id} value={props.show_id}>
                                Mark Watched
                            </Button>
                    }
                </Card.Body>
            </Card>
        </Col>
    )

};

export default Episode