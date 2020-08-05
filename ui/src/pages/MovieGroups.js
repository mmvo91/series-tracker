import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import api from "../Api";
import Movie from "../components/Movie";
import Title from "../components/Title";


const MovieGroups = () => {
    const [movieGroup, setMovieGroups] = useState(null);

    useEffect(() => {
        api.get('/movies/usergroups')
            .then(res => setMovieGroups(res.data))
    }, []);

    return (
        <Container fluid>
            <Title title="Movie Groups"/>
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