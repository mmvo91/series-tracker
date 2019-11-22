import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import api from "../Api";
import axios from "axios"
import {AsyncTypeahead} from 'react-bootstrap-typeahead';

import UserStore from "../stores/UserStore"
import {connect} from "overstated"

export default connect(UserStore)(class Subscription extends Component {
    state = {
        show: null,
        msg: null,
        shows: [],
        isLoading: false,
        selected: []
    };

    changeShow = (e) => {
        this.setState({
            isLoading: true,
        });

        axios.get('https://api.tvmaze.com/search/shows?q=' + e)
            .then(res => {
                this.setState({
                    isLoading: false,
                    shows: res.data
                })
            });
    };

    onSelect = (selected) => {
        this.setState({
            selected: selected
        });
    };

    newSub = (x) => {
        x.preventDefault();

        let data = {
            show: this.state.selected[0].show.name,
            show_id: this.state.selected[0].show.id
        };

        api.post('/users/' + this.props.store.state.id + '/subscriptions', data)
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
                                <AsyncTypeahead
                                    {...this.state}
                                    options={this.state.shows}
                                    id="score"
                                    labelKey={option => `${option.show.name}`}
                                    minLength={3}
                                    onSearch={this.changeShow}
                                    placeholder="Search show..."
                                    renderMenuItemChildren={(option) => (
                                        <div>
                                            <span className="pr-5">{option.show.name}</span>
                                            {
                                                option.show.image !== null
                                                    ? <Image
                                                        src={option.show.image.medium}
                                                        height="54"
                                                        width="40"/>
                                                    : null
                                            }
                                        </div>
                                    )}
                                    onChange={this.onSelect}
                                    selected={this.state.selected}
                                    className="py-2"
                                />
                                <div className="text-center text-muted">
                                    {this.state.msg}
                                </div>
                                <div className="py-2 text-center">
                                    <Button type="submit">
                                        New Subscription
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )
    }
})