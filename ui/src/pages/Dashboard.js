import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import Title from "../components/Title"
import SoloEpisode from "../components/SoloEpisodeCard";
import Spinner from "react-bootstrap/Spinner";

export default (class New extends Component {
    state = {
        new: null,
        queue: null,
        upcoming: null
    };

    componentDidMount() {
        api.get('/shows/new?size=4')
            .then(res => {
                this.setState({new: res.data['data']});
            });

        api.get('/shows/queue?size=4')
            .then(res => {
                this.setState({queue: res.data['data']});
            });

        api.get('/shows/upcoming?size=4')
            .then(res => {
                this.setState({upcoming: res.data['data']});
            })
    }

    render() {
        return (
            <div>
                <Title title="New"/>
                <Row>
                    {
                        this.state.new !== null
                            ? (
                                this.state.new.length !== 0
                                    ? this.state.new.map((datum) =>
                                        (
                                            <SoloEpisode
                                                key={datum.id}
                                                update={this.update}
                                                watched={datum.watched}
                                                {...datum}/>
                                        ))
                                    : <div className="w-100 text-center py-2">Nothing New</div>
                            )
                            : (
                                <div className="w-100 text-center py-2">
                                    <Spinner animation="border"
                                             variant="primary"/>
                                </div>
                            )

                    }
                </Row>

                <Title title="Queue"/>
                <Row>
                    {
                        this.state.queue !== null
                            ? (
                                this.state.queue.length !== 0
                                    ? this.state.queue.map((datum) =>
                                        (
                                            <SoloEpisode
                                                key={datum.id}
                                                update={this.update}
                                                watched={datum.watched}
                                                {...datum}/>
                                        ))
                                    : <div className="w-100 text-center py-2">Nothing New</div>
                            )
                            : (
                                <div className="w-100 text-center py-2">
                                    <Spinner animation="border"
                                             variant="primary"/>
                                </div>
                            )

                    }
                </Row>

                <Title title="Upcoming"/>
                <Row>
                    {
                        this.state.upcoming !== null
                            ? (
                                this.state.upcoming.length !== 0
                                    ? this.state.upcoming.map((datum) =>
                                        (
                                            <SoloEpisode
                                                key={datum.id}
                                                update={this.update}
                                                watched={datum.watched}
                                                {...datum}/>
                                        ))
                                    : <div className="w-100 text-center py-2">Nothing Upcoming</div>
                            )
                            : (
                                <div className="w-100 text-center py-2">
                                    <Spinner animation="border"
                                             variant="primary"/>
                                </div>
                            )

                    }
                </Row>
            </div>
        )
    }
})
