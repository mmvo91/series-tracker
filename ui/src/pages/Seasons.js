import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import Season from "../components/SeasonCard"
import ShowDisplay from "../components/ShowDisplay";

export default (class Seasons extends Component {
    state = {
        show: {},
        data: []
    };

    componentDidMount() {
        api.get('/shows/subscriptions/' + this.props.match.params.id)
            .then(res => {
                this.setState({show: res.data});
            });

        api.get('/shows/subscriptions/' + this.props.match.params.id + '/seasons')
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

        api.put('/shows/subscriptions/' + this.props.match.params.id + '/seasons', data)
            .then(() => {
                let current_data = this.state.data;
                current_data[idx]['watched'] = watched;
                this.setState({
                    data: current_data
                })
            })
    };

    render() {
        return (
            <div>
                <ShowDisplay {...this.state.show.show}/>
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
            </div>
        )
    }
})
