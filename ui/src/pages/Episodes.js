import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import Episode from "../components/EpisodeCard"

export default (class Episodes extends Component {
    state = {
        data: []
    };

    componentDidMount() {
        let url = '';
        if (this.props.match.params.season !== undefined) {
            url = '/shows/subscriptions/' + this.props.match.params.id + '/episodes?season=' + this.props.match.params.season;
        } else {
            url = '/shows/subscriptions/' + this.props.match.params.id + '/episodes';
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

        api.put('/shows/subscriptions/' + this.props.match.params.id + '/episodes', data)
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
