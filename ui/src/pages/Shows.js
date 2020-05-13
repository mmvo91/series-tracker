import React, {Component} from "react";
import {Row} from "react-bootstrap";
import api from "../Api"
import Show from "../components/ShowCard"
import Subscription from "../components/Subscription"

export default (class Shows extends Component {
    state = {
        data: []
    };

    componentDidMount() {
        api.get('/shows/subscriptions')
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
                <Subscription/>
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
            </div>
        )
    }
})
