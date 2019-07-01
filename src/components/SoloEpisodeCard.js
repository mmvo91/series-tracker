import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import moment from "moment"

const SoloEpisode = (props) => {
    console.log(props);
    return (
        <Col md={3} className="py-2">
            <Card>
                <Card.Body>
                    <Card.Title>{props.episode.name}</Card.Title>
                    <Card.Subtitle>{props.show.name}</Card.Subtitle>
                    <Image fluid src={props.episode.image}/>
                    <p><b>Air Date: </b>{moment(props.episode.air_date).format('MMMM Do YYYY')}</p>
                    <p><b>Season: </b>{props.episode.season} <b>Episode: </b>{props.episode.number}</p>
                    <div dangerouslySetInnerHTML={{__html: props.episode.summary}}/>
                    {
                        props.watched
                            ? <Button onClick={props.update} key={props.episode.id} id={props.episode.id}
                                      variant="danger">Mark Not
                                Watched</Button>
                            : <Button onClick={props.update} key={props.episode.id} id={props.episode.id}
                                      value={props.episode.show_id}>
                                Mark Watched
                            </Button>
                    }
                </Card.Body>
            </Card>
        </Col>
    )

};

export default SoloEpisode