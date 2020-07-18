import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import SoloEpisode from "../components/SoloEpisodeCard";
import Spinner from "react-bootstrap/Spinner";
import Title from "../components/Title";
import LoadMore from "../components/LoadMore";

export default (class New extends Component {
    state = {
        data: null,
        show: false,
        pagination: null,
    };

    componentDidMount() {
        api.get('shows/new')
            .then(res => {
                this.setState({data: res.data['data'], pagination: res.data['pagination']});
            })
    }

    render() {
        return (
            <div>
                <Title title="New"/>
                    <Row>
                        {
                            this.state.data !== null
                                ? (
                                    this.state.data.length !== 0
                                        ? this.state.data.map((datum) =>
                                            (
                                                <SoloEpisode
                                                    key={datum.episode.id}
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
