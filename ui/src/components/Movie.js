import React, {useState} from "react";
import api from "../Api";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Collapse from "react-bootstrap/Collapse";
import IconButton from "./IconButton";
import Button from "react-bootstrap/Button";

const Movie = (props) => {
    const [open, setCollapse] = useState(false);
    const [rotation, setRotation] = useState(null);
    const [watched, setWatch] = useState(props.watched)

    const update = (e) => {
        e.preventDefault();

        const data = {
            movie_id: props.movie.id,
            watched: !watched
        }

        api.put('/movies', data)
            .then(() => setWatch(!watched))
    }

    const remove = (e) => {
        e.preventDefault();

        const movie_id = e.target.id

        api.delete('/movies/' + movie_id)
            .then(() => {
                console.log('deleted')
            })
    }

    return (
        <Col md={3} lg={2} key={props.movie.id} className="py-2">
            <Card>
                <Card.Body>
                    <Card.Title>{props.movie.title}</Card.Title>
                    <Image fluid src={props.movie.image} className="mx-auto d-block my-3"/>
                    <div className="card-text">
                        <p><b>Premiere Date: </b>{moment.utc(props.movie.release).format('MMMM Do YYYY')}</p>
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
                                 dangerouslySetInnerHTML={{__html: props.movie.summary}}/>
                        </Collapse>
                    </div>
                    {
                        props.hasWatched !== false
                            ? (
                                <div className="text-center">
                                    {
                                        watched
                                            ? <IconButton
                                                update={update}
                                                id={props.movie.id}
                                                icon="check"
                                                color="text-success"
                                                text="Watched"/>
                                            : <IconButton
                                                update={update}
                                                id={props.movie.id}
                                                icon="check"
                                                text="Unwatched"/>
                                    }
                                    {
                                        props.removable !== false
                                            ? (
                                                <Button onClick={remove}
                                                        key={props.movie.id}
                                                        id={props.movie.id}
                                                        variant="white">
                                                    <FontAwesomeIcon icon="minus"
                                                                     className="text-danger"
                                                                     size="lg"/>
                                                    <br/>
                                                    <small>Remove</small>
                                                </Button>
                                            )
                                            : null
                                    }
                                </div>
                            )
                            : null
                    }
                </Card.Body>
            </Card>
        </Col>
    )
}

export default Movie