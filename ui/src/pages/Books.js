import React, {useState, useEffect} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Collapse from "react-bootstrap/Collapse";

import api from "../Api";
import Title from "../components/Title";
import IconButton from "../components/IconButton";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Book = (props) => {
    const [open, setCollapse] = useState(false);
    const [rotation, setRotation] = useState(null);
    const [watched, setWatched] = useState(props.watched)

    const update = () => {
        const data = {
            'read': !watched
        }

        api.post('/books/' + props.id, data)
            .then(() => setWatched(!watched))
    }

    return (
        <Col md={3} lg={2} key={props.id} className="py-2">
            <Card>
                <Card.Body>
                    <Card.Title>
                        {props.title}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {props.author}
                    </Card.Subtitle>
                    <Card.Text>
                        <div className="small">{props.subtitle}</div>
                        <Image fluid src={props.image} className="mx-auto d-block my-3"/>
                        <div>
                            <FontAwesomeIcon onClick={() => setCollapse(!open)}
                                             rotation={rotation}
                                             icon="chevron-right"/>
                            {' Summary'}
                        </div>
                        <Collapse in={open}
                                  onEntering={() => setRotation(90)}
                                  onExiting={() => setRotation(null)}>
                            <div className="py-2">
                                {props.description}
                            </div>
                        </Collapse>
                    </Card.Text>
                    <Card.Link className="float-right">
                        {
                            watched
                                ? <IconButton
                                    update={update}
                                    id={props.id}
                                    icon="check"
                                    color="text-success"
                                    text="Watched"/>
                                : <IconButton
                                    update={update}
                                    id={props.id}
                                    icon="check"
                                    text="Not Watched"/>
                        }
                    </Card.Link>
                </Card.Body>
            </Card>
        </Col>
    )
}

const AddBook = (props) => {
    const [msg, setMsg] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {
            isbn: e.target.name.value,
        }

        api.post('/books', data)
            .then(res => (
                setMsg(res.data['msg'])
            ))
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
                    Add Book
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>ISBN</Form.Label>
                        <Form.Control/>
                    </Form.Group>
                    <div className="text-center text-muted">
                        {msg}
                    </div>
                    <Modal.Footer>
                        <Button variant="danger" onClick={props.handleClose}>
                            Close
                        </Button>
                        <Button type="submit">
                            Add
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

const Books = () => {
    const [books, setBooks] = useState(null)
    const [show, setShow] = useState(false)

    useEffect(() => {
            api.get('/books')
                .then(res => {
                    setBooks(res.data)
                })
        }, [],
    );

    return (
        <Container fluid>
            <Title title="Books">
                <FontAwesomeIcon
                    onClick={() => setShow(true)}
                    icon="edit"
                />
            </Title>
            <AddBook
                show={show}
                handleClose={() => setShow(false)}
            />
            <Row>
                {
                    books !== null
                        ? books.map(
                        book => (
                            <Book {...book.book}
                                  watched={book.read}
                            />
                        ))
                        : <div className="w-100 text-center py-2">No books added</div>
                }
            </Row>
        </Container>
    )
}

export default Books
