import React, {useState, useEffect} from "react"
import {LinkContainer} from "react-router-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import api from "../Api";
import Title from "../components/Title";

const NewChannel = (props) => {
    const [msg, setMsg] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {
            link: e.target.name.value,
        }

        api.post('/channels', data)
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
                    Add YouTube Channel
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>Link</Form.Label>
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

const YouTube = () => {
    const [show, setShowNew] = useState(false)
    const [channels, setChannels] = useState(null)

    useEffect(() => {
            api.get('/channels')
                .then(res => {
                    setChannels(res.data)
                })
        }, [],
    );

    return (
        <Container fluid>
            <Title title="YouTube">
                <FontAwesomeIcon
                    onClick={() => setShowNew(true)}
                    icon="edit"
                />
            </Title>
            <NewChannel
                show={show}
                handleClose={() => setShowNew(false)}
            />
            <Row>
                {
                    channels !== null
                        ? channels.map(
                            channel => (
                                <Col md={3} lg={2} key={channel.channel.id} className="py-2">
                                    <LinkContainer to={"/youtube/channels/" + channel.channel.id}>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>
                                                    {channel.channel.title}
                                                </Card.Title>
                                                <Card.Text>
                                                    <Badge pill variant="primary">{channel.unwatched} Unwatched</Badge>
                                                    <Image fluid src={channel.channel.image} className="mx-auto d-block my-3"/>
                                                    <div>
                                                        {channel.channel.description}
                                                    </div>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </LinkContainer>
                                </Col>
                            )
                        )
                        :<div className="w-100 text-center py-2">No channels added</div>
                }
            </Row>
        </Container>
    )
}

export default YouTube