import React from 'react';
import './App.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import {faChevronRight, faTv} from '@fortawesome/free-solid-svg-icons'
import Container from "react-bootstrap/Container";
import {BrowserRouter as Router, Route} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute"
import Navigation from "./components/Navigation";
import Login from "./pages/Login"
import Register from "./pages/Register";
import Reset from "./pages/Reset"
import Shows from "./pages/Shows";
import Episodes from "./pages/Episodes"
import Seasons from "./pages/Seasons";
import Queue from "./pages/Queue";
import New from "./pages/New"

library.add(faChevronRight, faTv);

function App() {
    return (
        <Router>
            <Navigation/>
            <Container fluid className="py-2">
                <PrivateRoute exact path="/" component={Shows}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/reset" component={Reset}/>
                <PrivateRoute exact path="/new" component={New}/>
                <PrivateRoute exact path="/queue" component={Queue}/>
                <PrivateRoute exact path="/shows" component={Shows}/>
                <PrivateRoute exact path="/shows/:id" component={Episodes}/>
                <PrivateRoute exact path="/shows/:id/season" component={Seasons}/>
                <PrivateRoute exact path="/shows/:id/season/:season" component={Episodes}/>
            </Container>
        </Router>
    );
}

export default App;
