import React, {Component} from "react";
import axios from "axios";
import config from "../Config"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card";

import UserStore from "../stores/UserStore"
import {connect} from "overstated"
import LinkButton from "../components/LinkButton";
import {Link} from "react-router-dom"
import ButtonGroup from "react-bootstrap/ButtonGroup";

export default connect(UserStore)(class Login extends Component {
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

    loginUser = (e) => {
        e.preventDefault();

        const data = {
            username: this.state.username,
            password: this.state.password,
        };

        axios.post(config.url.API + '/token', data, {withCredentials: true})
            .then(res => {
                if (res.data['id']) {
                    this.props.store.loggedIn(res.data['id']);
                    if (this.props.location.pathname !== '/login') {
                        this.props.history.push(this.props.location.pathname)
                    } else {
                        this.props.history.push('/')
                    }
                } else {
                    this.setState({
                        message: res.data['msg']
                    });
                }
            })
            .catch(res => {
                    this.setState({
                        message: res.data['msg']
                    })
                }
            )
    };

    render() {
        return (
            <Card className="col-md-6 m-auto">
                <Card.Body>
                    <Card.Title>
                        Login
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
                        <div className="py-2 text-muted text-center">
                            {this.state.message}
                        </div>
                        <div className="text-center">
                            <ButtonGroup>
                                <Button onClick={this.loginUser}>
                                    Login
                                </Button>
                                <LinkButton to="/register" text="Register"/>
                            </ButtonGroup>
                            <div className="py-2">
                                <Link to="/reset">
                                    Reset
                                </Link>
                            </div>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        )
    }
})