'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class MovieService extends Service {

    async create(movie) {
        const { Movie } = this.server.models();
        
        return await Movie.query().insert(movie);
    }

    async update(id, movie) {
        const { Movie } = this.server.models();
        
        const updatedMovie = await Movie.query()
            .patchAndFetchById(id, movie);

        if (!updatedMovie) {
            throw Boom.notFound('Movie not found');
        }

        return updatedMovie;
    }

    async delete(id) {
        const { Movie } = this.server.models();
        
        const deleted = await Movie.query().deleteById(id);
        
        if (!deleted) {
            throw Boom.notFound('Movie not found');
        }
    }

    async getAll() {
        const { Movie } = this.server.models();
        return await Movie.query();
    }

    async getById(id) {
        const { Movie } = this.server.models();
        
        const movie = await Movie.query().findById(id);
        
        if (!movie) {
            throw Boom.notFound('Movie not found');
        }
        
        return movie;
    }

    async addToFavorites(userId, movieId) {
        const { Movie } = this.server.models();
        
        // Vérifie si le film existe
        const movie = await this.getById(movieId);
        
        try {
            await Movie.relatedQuery('favoritedBy')
                .for(movieId)
                .relate(userId);
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw Boom.conflict('Movie already in favorites');
            }
            throw err;
        }
    }

    async removeFromFavorites(userId, movieId) {
        const { Movie } = this.server.models();
        
        const deleted = await Movie.relatedQuery('favoritedBy')
            .for(movieId)
            .unrelate()
            .where('users.id', userId);
            
        if (!deleted) {
            throw Boom.notFound('Movie not found in favorites');
        }
    }

    async getUserFavorites(userId) {
        const { User } = this.server.models();
        
        return await User.relatedQuery('favoriteMovies')
            .for(userId);
    }
};
