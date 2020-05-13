import React, {useState, useEffect} from "react"
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import config from "../Config";
import api from "../Api";
import Movie from "../components/Movie";
import Title from "../components/Title";
import LoadMore from "../components/LoadMore";

const AddMovie = (props) => {
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

        api.post('/movies', selectedShow)
            .then(res => {
                changeMsg(res.data['msg'])
            })
    };

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            onExit={() => changeMsg(null)}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Adding Movie
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                <Modal.Footer>
                    <Button variant="danger" onClick={props.handleClose}>
                        Close
                    </Button>
                    <div>
                        <Button onClick={newSub}>
                            Add Movie
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    )
}

const Movies = () => {
    const [pagination, setPagination] = useState(null)
    const [movies, setMovies] = useState(null)
    const [showAddMovie, setAddMovie] = useState(false)

    useEffect(() => {
            api.get('/movies')
                .then(res => {
                    setPagination(res.data['pagination'])
                    setMovies(res.data['data'])
                })
        }, [],
    );

    const handleOpenAddMovie = () => {
        setAddMovie(true)
    }

    return (
        <Container fluid>
            <Title title="Movies">
                <FontAwesomeIcon
                    onClick={handleOpenAddMovie}
                    icon="edit"
                />
            </Title>
            <AddMovie show={showAddMovie} handleClose={() => setAddMovie(false)}/>
            <Row>
                {
                    movies !== null
                        ? movies.map(movie => (
                            <Movie
                                key={movie.movie.id}
                                {...movie}
                            />))
                        : <div className="w-100 text-center py-2">No movies added</div>
                }
            </Row>
            <LoadMore
                pagination={pagination}
                newPagination={setPagination}
                data={movies}
                newData={setMovies}
            />
        </Container>
    )
}

export default Movies