const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Backend Intern Assignment API",
        version: "1.0.0",
        description: "Secure Task Management API with JWT Authentication",
    },
    servers: [
        {
            url: "https://mega-backend-eamr.onrender.com/", // Your Render Backend URL
            description: "Production server"
        },
        {
            url: "http://localhost:3000",
            description: "Local development server"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    tags: [
        { name: "Auth", description: "User authentication" },
        { name: "Tasks", description: "Task management" }
    ],
    paths: {
        "/api/user/register": {
            post: {
                summary: "Register a new user",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    username: { type: "string" },
                                    email: { type: "string" },
                                    password: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "User registered successfully" }
                }
            }
        },
        "/api/user/login": {
            post: {
                summary: "User login",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string" },
                                    password: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Login successful" }
                }
            }
        },
        "/api/task/createTask": {
            post: {
                summary: "Create a new task",
                tags: ["Tasks"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: "Task created" }
                }
            }
        },
        "/api/task/getTask": {
            get: {
                summary: "Get all tasks",
                tags: ["Tasks"],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "List of tasks retrieved" }
                }
            }
        },
        "/api/task/updateTask/{id}": {
            patch: {
                summary: "Update a task",
                tags: ["Tasks"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    completed: { type: "boolean" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Task updated" }
                }
            }
        },
        "/api/task/deleteTask/{id}": {
            delete: {
                summary: "Delete a task",
                tags: ["Tasks"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    200: { description: "Task deleted" }
                }
            }
        }
    }
};

module.exports = swaggerDocument;