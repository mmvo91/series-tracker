import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import moment from "moment-timezone"
import IconButton from "../components/IconButton"

const Episode = (props) => {
    return (
        <Col sm={6} md={4} lg={3} className="py-2">
            <Card className="h-100">
                <Card.Body>
                    <Card.Title>{props.name}</Card.Title>
                    <Image fluid src={props.image} className="mx-auto d-block my-3"/>
                    <p><b>Air Date: </b>{moment.tz(props.air_date, 'Etc/UTC').tz(moment.tz.guess(true)).format('MMMM Do YYYY @ hh:mm A z')}</p>
                    <p><b>Season: </b>{props.season} <b>Episode: </b>{props.number}</p>
                    <div dangerouslySetInnerHTML={{__html: props.summary}}/>
                </Card.Body>
                <Card.Footer>
                    <div className="float-right">
                        {
                            props.hidden
                                ? <IconButton
                                    update={props.hide}
                                    id={props.id}
                                    icon="eye-slash"
                                    color="text-success"
                                    text="Hidden"/>
                                : <IconButton
                                    update={props.hide}
                                    id={props.id}
                                    icon="eye-slash"
                                    text="Not Hidden"/>
                        }
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
                    </div>
                </Card.Footer>
            </Card>
        </Col>
    )

};

export default Episode