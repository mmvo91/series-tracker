import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import moment from "moment"
import IconButton from "../components/IconButton"

const SoloEpisode = (props) => {
    return (
        <Col md={3} className="py-2">
            <Card>
                <Card.Body>
                    <Card.Title>{props.episode.name}</Card.Title>
                    <Card.Subtitle>{props.show.name}</Card.Subtitle>
                    <Image fluid src={props.episode.image} className="mx-auto d-block my-3"/>
                    <p><b>Air Date: </b>{moment.utc(props.episode.air_date).format('MMMM Do YYYY')}</p>
                    <p><b>Season: </b>{props.episode.season} <b>Episode: </b>{props.episode.number}</p>
                    <div dangerouslySetInnerHTML={{__html: props.episode.summary}}/>
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
                </Card.Body>
            </Card>
        </Col>
    )

};

export default SoloEpisode