module.exports = {
    apps: [
        {
            name: 'applicationtracker',
            script: 'server/dist/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            args: "dotenv_config_path=.env",
            env: {
                NODE_ENV: 'production',
                MONGO_URI: process.env.MONGO_URI,
                JWT_SECRET: process.env.JWT_SECRET,
                PORT: process.env.PORT,
                CLIENT_ORIGIN1: process.env.CLIENT_ORIGIN1,
                CLIENT_ORIGIN2: process.env.CLIENT_ORIGIN2,
                COOKIES_SECRET: process.env.COOKIES_SECRET,
                CSRF_SECRET: process.env.CSRF_SECRET,
                SESSION_SECRET: process.env.SESSION_SECRET,
            },
        },
    ],
};