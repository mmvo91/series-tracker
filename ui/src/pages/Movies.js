import React, {useState, useEffect} from "react"
import axios from "axios";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import config from "../Config";
import api from "../Api";
import Movie from "../components/Movie";
import Title from "../components/Title";
import {useStore} from "overstated";
import UserStore from "../stores/UserStore";

const AddMovie = () => {
    const {user_id} = useStore (UserStore, store => ({
        user_id: store.state.id,
    }));

    const [isLoading, changeLoading] = useState(false)
    const [shows, changeShows] = useState([])
    const [selectedShow, changeSelected] = useState(null)
    const [msg, changeMsg] = useState(null)

    const changeShow = (e) => {
        changeLoading(true)

        axios.get(config.url.OMDB + '?apikey=' + config.key.OMDB + '&s=' + e + '&type=movie')
            .then(res => {
                changeShows(res.data['Search'])
                changeLoading(false)
            });
    };

    const onSelect = (selected) => {
        changeSelected(selected[0])
    };

    const newSub = (x) => {
        x.preventDefault();

        api.post('/users/' + user_id + '/movies', selectedShow)
            .then(res => {
                changeMsg(res.data['msg'])
            })
    };

    return (
        <Card>
            <Card.Body>
                <AsyncTypeahead
                    isLoading={isLoading}
                    options={shows}
                    id="score"
                    labelKey={option => `${option.Title}`}
                    minLength={3}
                    onSearch={changeShow}
                    placeholder="Search movie..."
                    renderMenuItemChildren={(option) => (
                        <div>
                            <span className="pr-5">{option.Title}</span>
                            {
                                option.Poster !== null
                                    ? <Image
                                        src={option.Poster}
                                        height="54"
                                        width="40"/>
                                    : null
                            }
                        </div>
                    )}
                    onChange={onSelect}
                    className="py-2"
                />
                {
                    selectedShow !== null && selectedShow !== undefined
                        ? (
                            <div className="text-center">
                                <Image src={selectedShow.Poster}/>
                                <div>{selectedShow.Title} - {selectedShow.Year}</div>
                            </div>
                        )
                        : null
                }
                <div className="text-center text-muted">
                    {msg}
                </div>
                <div className="py-2 text-center">
                    <Button onClick={newSub}>
                        Add Movie
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}

const Movies = () => {
    const {user_id} = useStore (UserStore, store => ({
        user_id: store.state.id,
    }));
    const [movies, setMovies] = useState(null)

    useEffect(() => {
            api.get('/users/' + user_id + '/movies')
                .then(res => {
                    setMovies(res.data)
                })
        }, [],
    );

    return (
        <Container fluid>
            <Title title="Movies"/>
            <AddMovie/>
            <Row>
                {
                    movies !== null
                        ? movies.map(movie => (
                            <Movie
                                key={movie.movie.id}
                                {...movie}
                            />))
                        : "No movies added"
                }
            </Row>
        </Container>
    )
}

export default Movies