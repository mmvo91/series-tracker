import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {LinkContainer} from 'react-router-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import api from "../Api"

import {useStore} from 'overstated'
import UserStore from '../stores/UserStore'
import NavDropdown from "react-bootstrap/NavDropdown";

const LinkNav = (props) => {
    return (
        <LinkContainer to={props.to}>
            <NavDropdown.Item>{props.title}</NavDropdown.Item>
        </LinkContainer>
    )
};

const Navigation = () => {
    const {loggedIn, logOut} = useStore(UserStore, store => ({
        loggedIn: store.state.loggedIn,
        logOut: store.logOut
    }));

    const loggingOut = () => {
        api.delete('/token')
            .then(() => {
                logOut()
            });
    };

    return (
        <Navbar collapseOnSelect expand="sm" bg="primary" variant="dark">
            <LinkContainer to="/">
                <Navbar.Brand>
                    <FontAwesomeIcon
                        alt="icon"
                        width="30"
                        height="30"
                        icon="tv"/>
                    {' Tracker'}
                </Navbar.Brand>
            </LinkContainer>
            {
                loggedIn
                    ? (
                        <React.Fragment>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                            <Navbar.Collapse className="text-center" id="responsive-navbar-nav">
                                <Nav className="mr-auto">
                                    <NavDropdown id="show-dropdown" title="Shows">
                                        <LinkNav to={"/recent"} title="Recently Added"/>
                                        <LinkNav to={"/universe"} title="Universe"/>
                                        <LinkNav to={"/shows"} title="Shows"/>
                                        <LinkNav to={"/queue"} title="Queue"/>
                                        <LinkNav to={"/new"} title="New"/>
                                        <LinkNav to={"/upcoming"} title="Upcoming"/>
                                        <LinkNav to={"/completion"} title="Completion"/>
                                    </NavDropdown>
                                    <NavDropdown id={"movie-dropdown"} title={"Movies"}>
                                        <LinkNav to={"/movies"} title="Movies"/>
                                        <LinkNav to={"/groups"} title="Movie Groups"/>
                                        <LinkNav to={"/group-manager"} title={"Group Manager"}/>
                                    </NavDropdown>
                                    <NavDropdown id={"youtube-dropdown"} title={"YouTube"}>
                                        <LinkNav to={"/youtube/channels"} title={"Channels"}/>
                                        <LinkNav to={"/youtube/videos"} title={"Videos"}/>
                                    </NavDropdown>
                                    <LinkContainer to="/books">
                                        <Nav.Link>Books</Nav.Link>
                                    </LinkContainer>
                                </Nav>
                                <Nav>
                                    <Nav.Link href={"/"} onClick={loggingOut}>Logout</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </React.Fragment>
                    )
                    : null
            }
        </Navbar>
    )
};

export default Navigation