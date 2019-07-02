import {Store} from 'overstated';

export default class UserStore extends Store {
    state = {
        id: null,
        loggedIn: false,
    };

    loggedIn = (id) => {
        return this.setState({
            id: id,
            loggedIn: true
        })
    }
}