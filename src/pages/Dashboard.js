import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import Title from "../components/Title"
import SoloEpisode from "../components/SoloEpisodeCard";
import Spinner from "react-bootstrap/Spinner";

import UserStore from "../stores/UserStore"
import {connect} from "overstated"

export default connect(UserStore)(class New extends Component {
    state = {
        new: null,
        queue: null,
        upcoming: null
    };

    componentDidMount() {
        api.get('/users/' + this.props.store.state.id + '/new')
            .then(res => {
                this.setState({new: res.data});
            });

        api.get('/users/' + this.props.store.state.id + '/queue')
            .then(res => {
                this.setState({queue: res.data});
            })

        api.get('/users/' + this.props.store.state.id + '/upcoming')
            .then(res => {
                this.setState({upcoming: res.data});
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
                                    ? this.state.new.slice(0, 4).map((datum) =>
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
                                    ? this.state.queue.slice(0, 4).map((datum) =>
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
                                    ? this.state.upcoming.slice(0, 4).map((datum) =>
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
