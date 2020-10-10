import React, {useState} from "react";
import api from "../Api";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import moment from "moment";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconButton from "./IconButton";

const Video = (props) => {
    const [watched, setWatch] = useState(props.watched)

    const update = (e) => {
        e.preventDefault();

        const data = {
            video_id: props.video.id,
            watched: !watched
        }

        api.put('/channels/' + props.channel + '/videos', data)
            .then(() => setWatch(!watched))
    }

    return(
        <Col sm={6} md={4} lg={3} xl={2} key={props.video.id} className="py-2">
            <Card>
                <Card.Body>
                    <Card.Title>
                        {props.video.title}
                    </Card.Title>
                    <Card.Text>
                        <div>{moment(props.video.publishDate).format("MMMM Do YYYY")}</div>
                        <div>{moment("2015-01-01").startOf('day').seconds(props.video.duration).format('H [hours] m [minutes]')}</div>
                        <Image fluid src={props.video.image} className="mx-auto d-block my-3"/>
                        <div>
                            {props.video.description}
                        </div>
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <div>
                        <div className="text-center">
                            <Button
                                href={'https://www.youtube.com/watch?v=' + props.video.id}
                                variant="white"
                            >
                                <FontAwesomeIcon icon="link"
                                                 className="text-success"
                                                 size="glyphicon"/>
                                <br/>
                                <small>YouTube Link</small>
                            </Button>
                            {
                                watched
                                    ? <IconButton
                                        update={update}
                                        id={props.video.id}
                                        icon="check"
                                        color="text-success"
                                        text="Watched"/>
                                    : <IconButton
                                        update={update}
                                        id={props.video.id}
                                        icon="check"
                                        text="Not Watched"/>
                            }
                        </div>
                    </div>
                </Card.Footer>
            </Card>
        </Col>
    )

}

export default Video;