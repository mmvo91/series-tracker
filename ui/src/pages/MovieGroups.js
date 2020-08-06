import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Typeahead} from "react-bootstrap-typeahead";

import api from "../Api";
import Movie from "../components/Movie";
import Title from "../components/Title";

const AddExistingMovieGroup = (props) => {
    const [msg, setMsg] = useState(null)
    const [groups, setGroups] = useState([])
    const [selection, setSelect] = useState(null)

    useEffect(
        () => {
            api.get('/movies/groups')
                .then(res => {
                    setGroups(res.data)
                })
        }, []
    )

    const onSelectMovieGroup = (selected) => {
        if (selected.length > 0) {
            setSelect(selected[0]['id'])
        }
    }

    const handleClick = () => {
        const data = {
            movie_group_id: selection
        }

        api.post('/movies/usergroups', data)
            .then(res => setMsg(res.data['msg']))
    }

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            onExit={() => setMsg(null)}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Add Movie Group to User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Typeahead
                    id="groups"
                    options={groups}
                    onChange={onSelectMovieGroup}
                    labelKey="name"
                    placeholder="Select a group..."
                />
                <div className="py-2 text-center text-muted">
                    {msg}
                </div>
                <Modal.Footer>
                    <Button variant="danger" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button onClick={handleClick}>
                        Add MovieGroup to User
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    )
}

const MovieGroups = () => {
    const [movieGroup, setMovieGroups] = useState(null);
    const [showMovieGroups, setShowMovieGroups] = useState(false)

    useEffect(() => {
        api.get('/movies/usergroups')
            .then(res => setMovieGroups(res.data))
    }, []);

    const handleOpenMovieGroup = () => {
        setShowMovieGroups(true)
    }

    return (
        <Container fluid>
            <Title title="Movie Groups">
                <FontAwesomeIcon
                    onClick={handleOpenMovieGroup}
                    icon="edit"
                />
            </Title>
            <AddExistingMovieGroup show={showMovieGroups} handleClose={() => setShowMovieGroups(false)}/>
            {
                movieGroup !== null
                    ? (movieGroup.map(
                    group => (
                        <div key={group.movie_group.id}>
                            <Title title={group.movie_group.name}/>
                            <Row>
                                {
                                    group.movies.map(
                                        movie => (
                                            <Movie
                                                key={movie.movie.id}
                                                movie={movie.movie}
                                                watched={movie.watched}
                                                removable={false}
                                            />
                                        )
                                    )
                                }
                            </Row>
                        </div>
                    )
                    ))
                    : <div className="w-100 text-center py-2">Nothing in Movie Groups</div>
            }
        </Container>
    )
}

export default MovieGroups