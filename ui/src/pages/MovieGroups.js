import React, {useEffect, useState} from "react";
import api from "../Api";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Movie from "../components/Movie";
import Title from "../components/Title";

import UserStore from "../stores/UserStore";
import {useStore} from "overstated";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const NewMovieGroup = () => {
    const {user_id} = useStore(UserStore, store => ({
        user_id: store.state.id,
    }));

    const [msg, setMsg] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {
            name: e.target.name.value,
            description: e.target.description.value,
            type: e.target.type.value
        }

        api.post('users/' + user_id + '/movies/groups', data)
            .then(res => (
                setMsg(res.data['msg'])
            ))
    }

    return (
        <Card>
            <Card.Body>
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
                    <Button type="submit">
                        Add New Movie Group
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

const MovieGroups = () => {
    const {user_id} = useStore(UserStore, store => ({
        user_id: store.state.id,
    }));

    const [movieGroup, setMovieGroups] = useState(null);

    useEffect(() => {
        api.get('users/' + user_id + '/movies/groups')
            .then(res => setMovieGroups(res.data))
    }, []);

    return (
        <Container fluid>
            <Title title="Movie Groups"/>
            <NewMovieGroup/>
            {
                movieGroup !== null
                    ? (movieGroup.map(
                    group => (
                        <div>
                            <Title title={group.name}/>
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

export default MovieGroups