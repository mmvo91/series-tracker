import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import SoloEpisode from "../components/SoloEpisodeCard";

export default class Queue extends Component {
    state = {
        data: []
    };

    componentDidMount() {
        api.get('/users/1/queue')
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

        api.put('/users/1/subscriptions/' + e.target.value + '/episodes', data)
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
                    this.state.data.length !== 0
                        ? this.state.data.map((datum) =>
                            (
                                <SoloEpisode
                                    key={datum.id}
                                    update={this.update}
                                    watched={datum.watched}
                                    {...datum}/>
                            ))
                        : <span>Nothing in Queue</span>
                }
            </Row>
        )
    }
}
