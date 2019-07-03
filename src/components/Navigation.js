import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {LinkContainer} from 'react-router-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {useStore} from 'overstated'
import UserStore from '../stores/UserStore'

const LinkNav = (props) => {
    return (
        <LinkContainer to={props.to}>
            <Nav.Link>{props.title}</Nav.Link>
        </LinkContainer>
    )
};

const Navigation = () => {
    const {loggedIn} = useStore(UserStore, store => ({
        loggedIn: store.state.loggedIn,
    }));

    return (
        <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
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
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="mr-auto text-center">
                                    <LinkNav to={"/shows"} title="Shows"/>
                                    <LinkNav to={"/queue"} title="Queue"/>
                                    <LinkNav to={"/new"} title="New"/>
                                    <LinkNav to={"/upcoming"} title="Upcoming"/>
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