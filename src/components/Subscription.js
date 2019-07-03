import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import api from "../Api";

import UserStore from "../stores/UserStore"
import {connect} from "overstated"

export default connect(UserStore)(class Subscription extends Component {
    state = {
        show: null,
        msg: null
    };

    changeShow = (e) => {
        this.setState({
            show: e.target.value
        })
    };

    newSub = (x) => {
        x.preventDefault();

        api.post('/users/' + this.props.store.state.id + '/subscriptions', this.state)
            .then(res => {
                this.setState({
                    msg: res.data['msg']
                })
            })
    };

    render() {
        return (
            <Row>
                <Col className="py-2">
                    <Card>
                        <Card.Body>
                            <Form onSubmit={this.newSub}>
                                <Form.Group>
                                    <Form.Control type="text"
                                                  value={this.state.show}
                                                  onChange={this.changeShow}
                                                  placeholder="Show name..."/>
                                </Form.Group>
                                <div className="text-center text-muted">
                                    {this.state.msg}
                                </div>
                                <Button type="submit">
                                    New Subscription
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )
    }
})