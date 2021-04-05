import React, {useState} from "react";
import api from "../Api"
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import moment from "moment-timezone"
import IconButton from "../components/IconButton"

const SoloEpisode = (props) => {
    const [watched, setWatched] = useState(props.watched)
    const [hidden, setHidden] = useState(props.hidden)

    const update = (e) => {
        e.preventDefault();

        const data = {
            id: e.target.id,
            watched: !watched
        }

        api.put('/shows/subscriptions/' + e.target.value + '/episodes', data)
            .then(() => {
                setWatched(!watched)
            })

    }

    const hide = (e) => {
        e.preventDefault();

        const data = {
            id: e.target.id,
            hidden: !hidden
        }

        api.patch('/shows/subscriptions/' + e.target.value + '/episodes', data)
            .then(() => {
                setHidden(!hidden)
            })

    }

    return (
        <Col md={4} lg={3} className="py-2">
            <Card className="h-100">
                <Card.Body>
                    <Card.Title>{props.episode.name}</Card.Title>
                    <Card.Subtitle>{props.show.name}</Card.Subtitle>
                    <Image fluid src={props.episode.image} className="mx-auto d-block my-3"/>
                    <p>
                        <b>Air Date: </b>
                        {
                            moment.tz(props.episode.air_date, 'Etc/UTC')
                                .tz(moment.tz.guess(true))
                                .format('MMMM Do YYYY @ hh:mm A z')
                        }
                    </p>
                    <p><b>Season: </b>{props.episode.season} <b>Episode: </b>{props.episode.number}</p>
                    <div dangerouslySetInnerHTML={{__html: props.episode.summary}}/>
                </Card.Body>
                <Card.Footer>
                    <div className="float-right">
                        {
                            hidden
                                ? <IconButton
                                    update={hide}
                                    id={props.episode.id}
                                    value={props.episode.show_id}
                                    icon="eye-slash"
                                    color="text-success"
                                    text="Hidden"/>
                                : <IconButton
                                    update={hide}
                                    id={props.episode.id}
                                    value={props.episode.show_id}
                                    icon="eye-slash"
                                    text="Not Hidden"/>
                        }
                        {
                            watched
                                ? <IconButton
                                    update={update}
                                    id={props.episode.id}
                                    value={props.episode.show_id}
                                    icon="check"
                                    color="text-success"
                                    text="Watched"/>
                                : <IconButton
                                    update={update}
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