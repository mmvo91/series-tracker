const dev = {
    url: {
        API: "https://127.0.0.1:5000",
        OMDB: "http://www.omdbapi.com"
    },
    key: {
        OMDB: process.env.REACT_APP_OMDB_API_KEY
    }
};

const prod = {
    url: {
        API: "https://series-tracker.netlify.app/api",
        OMDB: "https://www.omdbapi.com"
    },
    key: {
        OMDB: process.env.REACT_APP_OMDB_API_KEY
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
