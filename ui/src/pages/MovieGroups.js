import React, {useEffect, useState} from "react";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import api from "../Api";
import Movie from "../components/Movie";
import Title from "../components/Title";

const NewMovieGroup = (props) => {
    const [msg, setMsg] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {
            name: e.target.name.value,
            description: e.target.description.value,
            type: e.target.type.value
        }

        api.post('/movies/groups', data)
            .then(res => (
                setMsg(res.data['msg'])
            ))
    }

    return (
        <Modal show={props.show} onHide={props.handleClose} onExit={() => setMsg(null)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Adding Movie Group
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control/>
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="3"/>
                    </Form.Group>
                    <Form.Group controlId="type">
                        <Form.Label>Type</Form.Label>
                        <Form.Control as="select">
                            <option>Trilogy</option>
                            <option>Universe</option>
                            <option>Collection</option>
                        </Form.Control>
                    </Form.Group>
                    <div className="text-center text-muted">
                        {msg}
                    </div>
                    <Modal.Footer>
                        <Button variant="danger" onClick={props.handleClose}>
                            Close
                        </Button>
                        <Button type="submit">
                            Add New Movie Group
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

const MovieGroups = () => {
    const [movieGroup, setMovieGroups] = useState(null);
    const [showEditMovieGroup, setShowEditMovieGroup] = useState(false);
    const [showMovieGroup, setShowMovieGroup] = useState(false);
    const [selectedGroup, setGroup] = useState({id: null})

    useEffect(() => {
        api.get('/movies/groups')
            .then(res => setMovieGroups(res.data))
    }, []);

    const handleOpenMovieGroup = () => {
        setShowMovieGroup(true)
    }

    const handleOpenEditMovieGroup = (group) => () => {
        setGroup(group)
        setShowEditMovieGroup(true)
    }

    const handleCloseEditMovieGroup = () => {
        setShowEditMovieGroup(false)
    }

    return (
        <Container fluid>
            <Title title="Movie Groups">
                <FontAwesomeIcon
                    onClick={handleOpenMovieGroup}
                    icon="edit"
                />
            </Title>
            <NewMovieGroup show={showMovieGroup} handleClose={() => setShowMovieGroup(false)}/>
            <AddMovieToMovieGroup show={showEditMovieGroup} group={selectedGroup} handleClose={handleCloseEditMovieGroup}/>
            {
                movieGroup !== null
                    ? (movieGroup.map(
                    group => (
                        <div key={group.id}>
                            <Title title={group.name}>
                                <FontAwesomeIcon
                                    onClick={handleOpenEditMovieGroup(group)}
                                    icon="edit"
                                />
                            </Title>
                            <Row>
                                {
                                    group.movies.map(
                                        movie => (
                                            <Movie
                                                key={movie.id}
                                                movie={movie}
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

const AddMovieToMovieGroup = (props) => {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null)
    const [movies, setMovies] = useState(null)
    const [selectedMovie, selectMovie] = useState(null)

    useEffect(() => {
            api.get('/movies')
                .then(res => {
                    setMovies(res.data['data']);
                })
        }
    , [])

    const changeShow = (e) => {
        setLoading(true)

        api.get('/movies?s=' + e)
            .then(res => {
                setMovies(res.data['data']);
                setLoading(false)
            })
    }

    const onSelectMovie = (selected) => {
        if (selected.length > 0){
            selectMovie(selected[0]['movie']['id'])
        }
    }

    const handleClick = () => {
        const data = {
            movie_id: selectedMovie,
            movie_group_id: props.group.id
        }

        api.put('/movies/groups', data)
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
                    Adding Movie to Movie Group
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="name">
                    <Form.Control
                        disabled
                        value={props.group.name}
                    />
                </Form.Group>
                <AsyncTypeahead
                    id="movie"
                    labelKey={option => `${option.movie.title}`}
                    options={movies}
                    onChange={onSelectMovie}
                    isLoading={loading}
                    onSearch={changeShow}
                    placeholder="Select movie..."
                    renderMenuItemChildren={(option) => (
                        <div>
                            <span className="pr-5">{option.movie.title}</span>
                            {
                                option.movie.image !== null
                                    ? <Image
                                        src={option.movie.image}
                                        height="54"
                                        width="40"/>
                                    : null
                            }
                        </div>
                    )}
                />
                <div className="py-2 text-center text-muted">
                    {msg}
                </div>
                <Modal.Footer>
                    <Button variant="danger" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button onClick={handleClick}>
                        Add Movie to Movie Group
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    )
}

export default MovieGroups