import React, {useState, useEffect} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import api from "../Api";
import Title from "../components/Title";
import IconButton from "../components/IconButton";
import LoadMore from "../components/LoadMore";


const Videos = (props) => {
    const [channel, setChannel] = useState({'title': 'Channel'})
    const [pagination, setPagination] = useState(null)
    const [videos, setVideos] = useState(null)

    useEffect(() => {
            api.get('/channels/' + props.match.params.id)
                .then(res => {
                    setChannel(res.data['channel'])
                })

            api.get('/channels/' + props.match.params.id + '/videos')
                .then(res => {
                    setPagination(res.data['pagination'])
                    setVideos(res.data['data'])
                })
        }, [],
    );

    return (
        <Container fluid>
            <Title title={channel.title}/>
            <Row>
                {
                    videos !== null
                        ? videos.map(video => (
                            <Video
                                key={video.video.id}
                                channel={props.match.params.id}
                                {...video}
                            />))
                        : <div className="w-100 text-center py-2">No videos in channel</div>
                }
            </Row>
            <LoadMore pagination={pagination} newPagination={setPagination} data={videos} newData={setVideos}/>
        </Container>
    )
}

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

export default Videos