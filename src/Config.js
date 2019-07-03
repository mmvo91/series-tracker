const dev = {
    url: {
        API: "http://127.0.0.1:5000"
    }
};

const prod = {
    url: {
        API: "https://series-track.herokuapp.com"
    }
};

const get_config = function () {
    switch (process.env.REACT_APP_STAGE) {
        case 'dev':
            return dev;
        default:
            return prod;
    }
};

const config = get_config();

export default config;