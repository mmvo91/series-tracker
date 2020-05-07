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

import UserStore from "../stores/UserStore"
import {useStore} from 'overstated';

const Movie = (props) => {
    const {user_id} = useStore (UserStore, store => ({
        user_id: store.state.id,
    }));

    const [open, setCollapse] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [watched, setWatch] = useState(props.watched)

    const update = (e) => {
        e.preventDefault();

        const data = {
            movie_id: props.movie.id,
            watched: !watched
        }

        api.put('/users/' + user_id + '/movies', data)
            .then(() => setWatch(!watched))
    }

    const remove = (e) => {
        e.preventDefault();

        const movie_id = e.target.id

        api.delete('/users/' + user_id + '/movies/' + movie_id)
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
                    <Card.Text>
                        <p><b>Premiere Date: </b>{moment.utc(props.movie.release).format('MMMM Do YYYY')}</p>
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
                                 dangerouslySetInnerHTML={{__html: props.movie.summary}}/>
                        </Collapse>
                    </Card.Text>
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
                    </div>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default Movie