import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Navigation = () => {
    return (
        <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
            <Navbar.Brand href="#home">
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
                    <Nav.Link href="/shows">Shows</Nav.Link>
                    <Nav.Link href="/queue">Queue</Nav.Link>
                    <Nav.Link href="/new">New</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
};

export default Navigation