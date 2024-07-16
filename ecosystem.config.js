module.exports = {
    apps: [
        {
            name: 'applicationtracker',
            script: 'server/dist/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                MONGO_URI: process.env.MONGO_URI,
                JWT_SECRET: process.env.JWT_SECRET,
                PORT: process.env.PORT,
                CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
                COOKIES_SECRET: process.env.COOKIES_SECRET,
                CSRF_SECRET: process.env.CSRF_SECRET,
                SESSION_SECRET: process.env.SESSION_SECRET,
            },
        },
    ],
};
