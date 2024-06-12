import * as swaggerJsdoc from "swagger-jsdoc";
import { Config } from "./config";

const PORT = Config.PORT;

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Teeket.Africa API",
            version: "1.0.0",
            description: "API documentation for Teeket.Africa",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },

        servers: [
            {
                url: `http://localhost:${PORT}`, // Update with your server URL
                description: "Local server",
            },
            {
                url: "https://www.api.teeket.africa/",
                description: "Production server",
            },
        ],
    },
    // Path to the API docs, using TypeScript paths
    apis: ["./src/Routes/*.ts"],
};

export default swaggerJsdoc.default(options);
