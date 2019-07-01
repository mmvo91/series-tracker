import React from 'react';
import './App.css';
import Container from "react-bootstrap/Container";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Login from "./pages/Login"
import Register from "./pages/Register";
import Reset from "./pages/Reset"
import Shows from "./pages/Shows";
import Episodes from "./pages/Episodes"
import Seasons from "./pages/Seasons";
import Queue from "./pages/Queue";
import New from "./pages/New"

function App() {
    return (
        <Router>
            <Container fluid className="py-2">
                <Route exact path="/" component={Shows}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/reset" component={Reset}/>
                <Route exact path="/new" component={New}/>
                <Route exact path="/queue" component={Queue}/>
                <Route exact path="/shows" component={Shows}/>
                <Route exact path="/shows/:id" component={Episodes}/>
                <Route exact path="/shows/:id/season" component={Seasons}/>
                <Route exact path="/shows/:id/season/:season" component={Episodes}/>
            </Container>
        </Router>
    );
}

export default App;
