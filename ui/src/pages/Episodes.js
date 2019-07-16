import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import Episode from "../components/EpisodeCard"

import UserStore from "../stores/UserStore"
import {connect} from "overstated"

export default connect(UserStore)(class Episodes extends Component {
    state = {
        data: []
    };

    componentDidMount() {
        let url = '';
        if (this.props.match.params.season !== undefined) {
            url = '/users/' + this.props.store.state.id + '/subscriptions/' + this.props.match.params.id + '/episodes?season=' + this.props.match.params.season;
        } else {
            url = '/users/' + this.props.store.state.id + '/subscriptions/' + this.props.match.params.id + '/episodes';
        }

        api.get(url)
            .then(res => {
                this.setState({data: res.data});
            })
    }

    update = (e) => {
        e.preventDefault();

        const watched_id = e.target.id;

        let previous_data = this.state.data;

        let idx = previous_data.findIndex(item => {
            return item.episode.id.toString() === watched_id.toString()
        });

        const data = {
            id: watched_id,
            watched: !this.state.data[idx]['watched']
        };

        api.put('/users/' + this.props.store.state.id + '/subscriptions/' + this.props.match.params.id + '/episodes', data)
            .then(res => {


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
                    this.state.data.map((datum) =>
                        (
                            <Episode
                                key={datum.id}
                                update={this.update}
                                watched={datum.watched}
                                {...datum.episode}/>
                        ))
                }
            </Row>
        )
    }
})
