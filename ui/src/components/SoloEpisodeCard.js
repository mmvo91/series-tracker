import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import moment from "moment"
import IconButton from "../components/IconButton"

const SoloEpisode = (props) => {
    return (
        <Col md={4} lg={3} className="py-2">
            <Card className="h-100">
                <Card.Body>
                    <Card.Title>{props.episode.name}</Card.Title>
                    <Card.Subtitle>{props.show.name}</Card.Subtitle>
                    <Image fluid src={props.episode.image} className="mx-auto d-block my-3"/>
                    <p><b>Air Date: </b>{moment(props.episode.air_date).local().format('MMMM Do YYYY @ hh:mm A')}</p>
                    <p><b>Season: </b>{props.episode.season} <b>Episode: </b>{props.episode.number}</p>
                    <div dangerouslySetInnerHTML={{__html: props.episode.summary}}/>
                </Card.Body>
                <Card.Footer>
                    <div className="float-right">
                        {
                            props.watched
                                ? <IconButton
                                    update={props.update}
                                    id={props.episode.id}
                                    value={props.episode.show_id}
                                    icon="check"
                                    color="text-success"
                                    text="Watched"/>
                                : <IconButton
                                    update={props.update}
                                    id={props.episode.id}
                                    value={props.episode.show_id}
                                    icon="check"
                                    text="Not Watched"/>
                        }
                    </div>
                </Card.Footer>
            </Card>
        </Col>
    )

};

export default SoloEpisode