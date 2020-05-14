import React, {Component} from "react";
import {Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import api from "../Api"
import Show from "../components/ShowCard"
import Subscription from "../components/Subscription"
import Title from "../components/Title";
import LoadMore from "../components/LoadMore";

export default (class Shows extends Component {
    state = {
        data: [],
        show: false,
        pagination: null,
    };

    componentDidMount() {
        api.get('/shows/subscriptions')
            .then(res => {
                this.setState({data: res.data['data'], pagination: res.data['pagination']})
            })
    }

    update = (e) => {
        e.preventDefault();

        const show_id = e.target.id;

        let idx = this.state.data.findIndex(item => {
            return item.show['id'].toString() === show_id.toString()
        });

        const data = {
            show_id: show_id,
            watched: !this.state.data[idx]['watched']
        };

        api.put('/shows/subscriptions', data)
            .then(() => {
                let current_data = this.state.data;
                current_data[idx]['watched'] = !this.state.data[idx]['watched'];
                this.setState({
                    data: current_data
                })
            })
    };

    delete = (e) => {
        e.preventDefault();

        const show_id = e.target.id;

        api.delete('/shows/subscriptions/' + show_id)
            .then(() => {
                console.log('deleted')
            })
    };

    render() {
        return (
            <div>
                <Title title="Shows">
                    <FontAwesomeIcon
                        onClick={() => this.setState({show: true})}
                        icon="edit"
                    />
                </Title>
                <Subscription
                    show={this.state.show}
                    handleClose={() => this.setState({show: false})}
                />
                <Row>
                    {
                        this.state.data.map((datum) => (
                            <Show key={datum.show.id}
                                  update={this.update}
                                  delete={this.delete}
                                  watched={datum.watched}
                                  {...datum.show}/>
                        ))
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
