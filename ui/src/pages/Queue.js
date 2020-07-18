import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner"
import api from "../Api"
import SoloEpisode from "../components/SoloEpisodeCard";
import LoadMore from "../components/LoadMore";
import Title from "../components/Title";

export default (class Queue extends Component {
    state = {
        data: null,
        show: false,
        pagination: null
    };

    componentDidMount() {
        api.get('/shows/queue')
            .then(res => {
                this.setState({data: res.data['data'], pagination: res.data['pagination']});
            })
    }

    render() {
        return (
            <div>
                <Title title="Queue"/>
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
