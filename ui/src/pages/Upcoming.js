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
