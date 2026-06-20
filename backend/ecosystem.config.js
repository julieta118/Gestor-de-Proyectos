module.exports = {
    apps: [
        {
            name: "gestor_de_proyectos1",
            script: "dist/main.js",
            env: {
                NODE_ENV: "production",
                PORT: 4000,
                DB_HOST: "localhost",
                DB_PORT: 5432,
                DB_USERNAME: "postgres",
                DB_PASSWORD: "2026",
                DB_NAME: "gestor_de_proyectos1",
                DB_LOGGING: "false",
                SWAGGER_HABILITADO: false,
                JWT_SECRET: "dfhw4e57y56uiythkjmdg"
            },
            time: true,
        },
    ],
};
