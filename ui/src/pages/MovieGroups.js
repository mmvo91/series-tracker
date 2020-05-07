import React, {useEffect, useState} from "react";
import api from "../Api";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Movie from "../components/Movie";
import Title from "../components/Title";

import UserStore from "../stores/UserStore";
import {useStore} from "overstated";


const MovieGroups = () => {
    const {user_id} = useStore (UserStore, store => ({
        user_id: store.state.id,
    }));

    const [movieGroup, setMovieGroups] = useState(null);

    useEffect(() => {
        api.get('users/' + user_id + '/movies/groups')
            .then(res => setMovieGroups(res.data))
    }, []);

    return (
        <Container fluid className="py-2">
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