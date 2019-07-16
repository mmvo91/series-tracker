import React, {Component} from "react";
import axios from "axios";
import config from "../Config"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card";

export default class Register extends Component {
    state = {
        username: null,
        password: null,
        message: null
    };

    changeParams = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    createUser = (e) => {
        e.preventDefault();

        const data = {
            username: this.state.username,
            password: this.state.password,
        };

        axios.post(config.url.API + '/users', data)
            .then(res => {
                this.setState({
                    message: res.data['msg']
                })
            })
    };

    render() {
        return (
            <Card className="col-md-6 m-auto">
                <Card.Body>
                    <Card.Title>
                        Register
                    </Card.Title>
                    <Form>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={this.state.username}
                                onChange={this.changeParams}
                                placeholder="Username..."/>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={this.state.password}
                                onChange={this.changeParams}
                                placeholder="Password..."/>
                        </Form.Group>
                        <Button onClick={this.createUser}>
                            Create
                        </Button>
                    </Form>
                    <Card.Text className="py-2 text-muted">
                        {this.state.message}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}