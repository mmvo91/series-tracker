import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {LinkContainer} from 'react-router-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const LinkNav = (props) => {
    return (
        <LinkContainer to={props.to}><Nav.Link>{props.title}</Nav.Link></LinkContainer>
    )
};

const Navigation = () => {
    return (
        <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
            <Navbar.Brand href="/">
                <FontAwesomeIcon
                    alt="icon"
                    width="30"
                    height="30"
                    icon="tv"/>
                {' Tracker'}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto text-center">
                    <LinkNav to={"/shows"} title="Shows"/>
                    <LinkNav to={"/queue"} title="Queue"/>
                    <LinkNav to={"/new"} title="New"/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
};

export default Navigation