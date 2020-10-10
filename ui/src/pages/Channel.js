import React, {useEffect, useState} from "react"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import api from "../Api";
import Title from "../components/Title";
import Video from "../components/Video";
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
        }, [props.match.params.id],
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

export default Videos