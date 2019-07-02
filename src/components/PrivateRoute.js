import {useStore} from "overstated";
import UserStore from "../stores/UserStore";
import React from "react";
import {Redirect, Route} from "react-router-dom";

const PrivateRoute = ({component: Component, ...rest}) => {
    const {loggedIn} = useStore(UserStore, store => ({
        loggedIn: store.state.loggedIn,
    }));

    return (
        <Route {...rest} render={(props) => (
            loggedIn === true
                ? (<Component {...props} />)
                : (<Redirect to={{
                    pathname: '/login',
                    state: {from: props.location}
                }}/>)
        )}/>
    );
};

export default PrivateRoute;