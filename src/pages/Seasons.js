import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import Season from "../components/SeasonCard"

import UserStore from "../stores/UserStore"
import {connect} from "overstated"

export default connect(UserStore)(class Seasons extends Component {
    state = {
        data: []
    };

    componentDidMount() {
        api.get('/users/' + this.props.store.state.id + '/subscriptions/' + this.props.match.params.id + '/seasons')
            .then(res => {
                this.setState({data: res.data});
            })
    }

    update = (e) => {
        e.preventDefault();

        const season = e.target.id;

        let idx = this.state.data.findIndex(item => {
            return item.season.number.toString() === season.toString()
        });

        let watched = !this.state.data[idx]['watched'];

        const data = {
            season: season,
            watched: watched
        };

        api.put('/users/' + this.props.store.state.id + '/subscriptions/' + this.props.match.params.id + '/seasons', data)
            .then(res => {
                let current_data = this.state.data;
                current_data[idx]['watched'] = watched;
                this.setState({
                    data: current_data
                })
            })
    };

    render() {
        return (
            <Row>
                {
                    this.state.data.map((datum) =>
                        (
                            <Season
                                show_id={this.props.match.params.id}
                                key={datum}
                                update={this.update}
                                watched={datum.watched}
                                {...datum.season}/>
                        ))
                }
            </Row>
        )
    }
})
