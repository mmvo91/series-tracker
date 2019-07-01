import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import Show from "../components/ShowCard"
import Subscription from "../components/Subscription"

export default class Shows extends Component {
    state = {
        data: []
    };

    componentDidMount() {
        api.get('/users/1/subscriptions')
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

        api.put('/users/1/subscriptions', data)
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

        api.delete('/users/1/subscriptions/' + show_id)
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
}
