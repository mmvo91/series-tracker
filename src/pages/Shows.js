import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import Show from "../components/ShowCard"
import Subscription from "../components/Subscription"

import UserStore from "../stores/UserStore"
import {connect} from "overstated"

export default connect(UserStore)(class Shows extends Component {
    state = {
        data: []
    };

    componentDidMount() {
        api.get('/users/' + this.props.store.state.id + '/subscriptions')
            .then(res => {
                this.setState({data: res.data})
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

        api.put('/users/' + this.props.store.state.id + '/subscriptions', data)
            .then(res => {
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

        api.delete('/users/' + this.props.store.state.id + '/subscriptions/' + show_id)
            .then(res => {
                console.log('deleted')
            })
    };

    render() {
        return (
            <div>
                <Subscription/>
                <Row>
                    {
                        this.state.data.map((datum) => (
                            <Show update={this.update}
                                  delete={this.delete}
                                  watched={datum.watched}
                                  {...datum.show}/>
                        ))
                    }
                </Row>
            </div>
        )
    }
})
