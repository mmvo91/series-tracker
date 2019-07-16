import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"

import UserStore from "../stores/UserStore"
import {connect} from "overstated"
import ProgressMeter from "../components/ProgressMeter";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import {LinkContainer} from "react-router-bootstrap";

export default connect(UserStore)(class Completion extends Component {
    state = {
        data: null
    };

    componentDidMount() {
        api.get('/users/' + this.props.store.state.id + '/completion')
            .then(res => {
                this.setState({data: res.data})
            })
    }

    render() {
        if (this.state.data !== null) {
            return (
                <Row>
                    <Col md={4} lg={3} className="py-2">
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    Completion %
                                </Card.Title>
                                <ProgressMeter completed={this.state.data.overall.watched_subscriptions}
                                               available={this.state.data.overall.subscriptions}
                                               type={'Subscriptions'}/>
                                <ProgressMeter completed={this.state.data.overall.watched_seasons}
                                               available={this.state.data.overall.seasons}
                                               type={'Seasons'}/>
                                <ProgressMeter completed={this.state.data.overall.watched_episodes}
                                               available={this.state.data.overall.episodes}
                                               type={'Episodes'}/>
                            </Card.Body>
                        </Card>
                    </Col>
                    {
                        this.state.data.show.map(show => (
                                <Col md={4} lg={3} className="py-2">
                                    <LinkContainer to={"/shows/" + show.id + "/season"}>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>
                                                    {show.show}
                                                </Card.Title>

                                                <Image fluid src={show.image} className="mx-auto d-block"/>

                                                <div className="d-flex justify-content-center py-2">
                                                    <ProgressMeter completed={show.watched_seasons}
                                                                   available={show.seasons}
                                                                   type={'Seasons'}/>
                                                    <ProgressMeter completed={show.watched_episodes}
                                                                   available={show.episodes}
                                                                   type={'Episodes'}/>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </LinkContainer>
                                </Col>
                            )
                        )
                    }
                </Row>
            )
        } else {
            return null
        }
    }
})
