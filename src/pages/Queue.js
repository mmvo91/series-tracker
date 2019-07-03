import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner"
import api from "../Api"
import SoloEpisode from "../components/SoloEpisodeCard";

import UserStore from "../stores/UserStore"
import {connect} from "overstated"

export default connect(UserStore)(class Queue extends Component {
    state = {
        data: null
    };

    componentDidMount() {
        api.get('/users/' + this.props.store.state.id + '/queue')
            .then(res => {
                this.setState({data: res.data});
            })
    }

    update = (e) => {
        e.preventDefault();

        const watched_id = e.target.id;

        const data = {
            id: watched_id
        };

        api.put('/users/' + this.props.store.state.id + '/subscriptions/' + e.target.value + '/episodes', data)
            .then(res => {
                let previous_data = this.state.data;

                let idx = previous_data.findIndex(item => {
                    return item.episode.id.toString() === watched_id.toString()
                });

                previous_data[idx]['watched'] = !this.state.data[idx]['watched'];

                this.setState({
                    data: previous_data
                })
            })
    };

    render() {
        return (
            <Row>
                {
                    this.state.data !== null
                        ? (
                            this.state.data.length !== 0
                                ? (
                                    this.state.data.map((datum) =>
                                        (
                                            <SoloEpisode
                                                key={datum.id}
                                                update={this.update}
                                                watched={datum.watched}
                                                {...datum}/>
                                        ))
                                )
                                : <div className="w-100 text-center py-2">Nothing in Queue</div>
                        )
                        : (
                            <div className="w-100 text-center py-2">
                                <Spinner animation="border"
                                         variant="primary"/>
                            </div>
                        )
                }
            </Row>
        )
    }
})
