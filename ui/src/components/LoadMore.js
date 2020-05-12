import React, {useState} from "react";
import Button from "react-bootstrap/Button";

import api from "../Api";


const LoadMore = (props) => {
    const [hasNext, setHasNext] = useState(true)

    const getMore = () => {
        api.get(props.pagination['next'])
            .then(res => {
                props.newPagination(res.data['pagination'])
                props.newData(props.data.concat(res.data['data']))
                setHasNext(res.data['pagination']['hasNext'])
            })
    }

    if (hasNext){
        return(
            <Button className="py-2" onClick={getMore} size="sm" block>
                Load More...
            </Button>
        )
    } else {
        return(null)
    }
}

export default LoadMore