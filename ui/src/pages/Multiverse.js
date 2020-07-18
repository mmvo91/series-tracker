import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import Spinner from "react-bootstrap/Spinner"
import api from "../Api"
import Card from "react-bootstrap/Card";
import LinkButton from "../components/LinkButton";

export default (class Multiverse extends Component {
    state = {
        data: null
    };

    componentDidMount = () => {
        api.get('/shows/universe')
            .then(res => {
                this.setState({data: res.data});
            })
    };

    render() {
        return (
            <Row>
                {
                    this.state.data !== null
                        ? (
                            this.state.data.map(datum => (
                                <Col key={datum.id} sm={6} md={4} lg={3} className="py-2">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{datum.name}</Card.Title>
                                            <div className="text-center">
                                                <LinkButton to={"/universe/" + datum.id} text={'Enter'}/>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )
                        : (
                            <div className="w-100 text-center py-2">
                                <Spinner animation="border"
                                         variant="primary"/>
                            </div>
                        )
                }
            </Row>
        )
    }
})