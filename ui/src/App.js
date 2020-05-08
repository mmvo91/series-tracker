import React from 'react';
import './scss/custom.scss'
import './App.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import {faCheck, faChevronRight, faEdit, faExpand, faMinus, faPlus, faTv} from '@fortawesome/free-solid-svg-icons'
import Container from "react-bootstrap/Container";
import {BrowserRouter as Router, Route} from "react-router-dom";
import api from "./Api"
import PrivateRoute from "./components/PrivateRoute"
import Navigation from "./components/Navigation";
import Spinner from "react-bootstrap/Spinner";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"
import Register from "./pages/Register";
import Reset from "./pages/Reset"
import Shows from "./pages/Shows";
import Episodes from "./pages/Episodes"
import Seasons from "./pages/Seasons";
import Queue from "./pages/Queue";
import New from "./pages/New"
import Completion from "./pages/Completion"
import Upcoming from "./pages/Upcoming";
import RecentSub from "./pages/RecentSub";
import Multiverse from "./pages/Multiverse";
import Universe from "./pages/Universe";
import Movies from "./pages/Movies";
import MovieGroups from "./pages/MovieGroups";

import UserStore from "./stores/UserStore"
import {connect} from "overstated"

library.add(faChevronRight, faTv, faExpand, faCheck, faMinus, faPlus, faEdit);

class App extends React.Component {
    state = {
        auth: false
    };

    componentWillMount = () => {
        api.get('/token')
            .then(res => {
                this.props.store.loggedIn(res.data['id']);
                this.setState({auth: true})
            })
            .catch(() => {
                this.setState({auth: true})
            })
    };


    render() {
        if (this.state.auth === true) {
            return (
                <Router>
                    <Navigation/>
                    <Container fluid className="py-2">
                        <PrivateRoute exact path="/" component={Dashboard}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/register" component={Register}/>
                        <Route path="/reset" component={Reset}/>
                        <PrivateRoute exact path="/new" component={New}/>
                        <PrivateRoute exact path="/completion" component={Completion}/>
                        <PrivateRoute exact path="/upcoming" component={Upcoming}/>
                        <PrivateRoute exact path="/queue" component={Queue}/>
                        <PrivateRoute exact path="/recent" component={RecentSub}/>
                        <PrivateRoute exact path="/shows" component={Shows}/>
                        <PrivateRoute exact path="/shows/:id" component={Episodes}/>
                        <PrivateRoute exact path="/shows/:id/season" component={Seasons}/>
                        <PrivateRoute exact path="/shows/:id/season/:season" component={Episodes}/>
                        <PrivateRoute exact path="/universe" component={Multiverse}/>
                        <PrivateRoute exact path="/universe/:id" component={Universe}/>
                        <PrivateRoute exact path="/movies" component={Movies}/>
                        <PrivateRoute exact path="/groups" component={MovieGroups}/>
                    </Container>
                </Router>
            );
        } else {
            return (
                <div className="w-100 text-center py-2">
                    <Spinner animation="border"
                             variant="primary"/>
                </div>
            )
        }
    }
}

export default connect(UserStore)(App);
