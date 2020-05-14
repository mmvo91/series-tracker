import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner"
import api from "../Api"
import SoloEpisode from "../components/SoloEpisodeCard";
import Title from "../components/Title";
import LoadMore from "../components/LoadMore";

export default (class Upcoming extends Component {
    state = {
        data: null,
        show: false,
        pagination: null,
    };

    componentDidMount() {
        api.get('/shows/upcoming')
            .then(res => {
                this.setState({data: res.data['data'], pagination: res.data['pagination']});
            })
    }

    update = (e) => {
        e.preventDefault();

        const watched_id = e.target.id;

        let idx = this.state.data.findIndex(item => {
            return item.episode.id.toString() === watched_id.toString()
        });

        const data = {
            id: watched_id,
            watched: !this.state.data[idx]['watched']
        };

        api.put('/shows/subscriptions/' + e.target.value + '/episodes', data)
            .then(() => {
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
            <div>
                <Title title="Upcoming"/>
                <Row>
                    {
                        this.state.data !== null
                            ? (
                                this.state.data.length !== 0
                                    ? (
                                        this.state.data.map((datum) =>
                                            (
                                                <SoloEpisode
                                                    key={datum.episode.id}
                                                    update={this.update}
                                                    watched={datum.watched}
                                                    {...datum}/>
                                            ))
                                    )
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
                <LoadMore
                    pagination={this.state.pagination}
                    newPagination={(e) => this.setState({pagination: e})}
                    data={this.state.data}
                    newData={(e) => this.setState({data: e})}
                />
            </div>
        )
    }
})
