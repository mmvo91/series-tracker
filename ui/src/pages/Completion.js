import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"

import ProgressMeter from "../components/ProgressMeter";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import {LinkContainer} from "react-router-bootstrap";
import Badge from "react-bootstrap/Badge";

export default (class Completion extends Component {
    state = {
        data: null
    };

    componentDidMount() {
        api.get('/shows/completion')
            .then(res => {
                this.setState({data: res.data})
            })
    }

    formatter = (num) => {
        if (Number.isInteger(num)) {
            return num
        } else {
            return (num).toFixed(2)
        }
    };

    render() {
        if (this.state.data !== null) {
            return (
                <Row>
                    <Col md={4} lg={3} xl={2} className="py-2">
                        <Card className="h-100">
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
                            <Col key={show.show_id} md={4} lg={3} xl={2} className="py-2">
                                    <LinkContainer to={"/shows/" + show.show_id + "/season"}>
                                        <Card className="h-100">
                                            <Card.Body>
                                                <Card.Title>
                                                    {show.name}
                                                </Card.Title>

                                                <Image fluid src={show.image} className="mx-auto d-block"/>

                                                <div className="h6 text-center py-3">
                                                    <Badge pill variant="secondary">
                                                        {this.formatter(show.unwatched_run_time / 60)} hour(s) remaining
                                                    </Badge>
                                                </div>

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
