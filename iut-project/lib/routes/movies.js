'use strict';

const Joi = require('joi');

module.exports = [{
    method: 'POST',
    path: '/movies',
    options: {
        auth: {
            scope: ['admin']
        },
        tags: ['api'],
        validate: {
            payload: Joi.object({
                title: Joi.string().required(),
                description: Joi.string().required(),
                releaseDate: Joi.date().required(),
                director: Joi.string().required()
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        return await movieService.create(request.payload);
    }
}, {
    method: 'PUT',
    path: '/movies/{id}',
    options: {
        auth: {
            scope: ['admin']
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().required()
            }),
            payload: Joi.object({
                title: Joi.string(),
                description: Joi.string(),
                releaseDate: Joi.date(),
                director: Joi.string()
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        return await movieService.update(request.params.id, request.payload);
    }
}, {
    method: 'DELETE',
    path: '/movies/{id}',
    options: {
        auth: {
            scope: ['admin']
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().required()
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        await movieService.delete(request.params.id);
        return h.response().code(204);
    }
}, {
    method: 'GET',
    path: '/movies',
    options: {
        auth: {
            scope: ['user', 'admin']
        },
        tags: ['api']
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        return await movieService.getAll();
    }
}, {
    method: 'GET',
    path: '/movies/{id}',
    options: {
        auth: {
            scope: ['user', 'admin']
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().required()
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        return await movieService.getById(request.params.id);
    }
}, {
    method: 'POST',
    path: '/movies/{id}/favorites',
    options: {
        auth: {
            scope: ['user']
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().required()
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        await movieService.addToFavorites(request.auth.credentials.id, request.params.id);
        return h.response().code(201);
    }
}, {
    method: 'DELETE',
    path: '/movies/{id}/favorites',
    options: {
        auth: {
            scope: ['user']
        },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().required()
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        await movieService.removeFromFavorites(request.auth.credentials.id, request.params.id);
        return h.response().code(204);
    }
}, {
    method: 'GET',
    path: '/movies/favorites',
    options: {
        auth: {
            scope: ['user']
        },
        tags: ['api']
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        return await movieService.getUserFavorites(request.auth.credentials.id);
    }
}];
