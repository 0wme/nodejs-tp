'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class MovieService extends Service {

    async create(movie) {
        const { Movie } = this.server.models();
        const { mailService } = this.server.services();
        const { User } = this.server.models();
        
        // Créer le film
        const newMovie = await Movie.query().insert(movie);

        try {
            // Récupérer tous les utilisateurs pour les notifier
            const users = await User.query();
            
            // Envoyer les notifications
            await mailService.sendNewMovieNotification(users, newMovie);
        } catch (error) {
            console.error('Failed to send new movie notifications:', error);
            // On continue même si l'envoi des notifications échoue
        }

        return newMovie;
    }

    async update(id, movieData) {
        const { Movie, User } = this.server.models();
        const { mailService } = this.server.services();
        
        // Récupérer l'ancien état du film
        const oldMovie = await Movie.query().findById(id);
        if (!oldMovie) {
            throw Boom.notFound('Movie not found');
        }

        // Mettre à jour le film
        const updatedMovie = await Movie.query()
            .patchAndFetchById(id, movieData);

        try {
            // Identifier les changements
            const changes = {};
            for (const [key, value] of Object.entries(movieData)) {
                if (oldMovie[key] !== value) {
                    changes[key] = value;
                }
            }

            // Si des changements ont été effectués
            if (Object.keys(changes).length > 0) {
                // Récupérer les utilisateurs qui ont ce film en favoris
                const users = await User.query()
                    .joinRelated('favoriteMovies')
                    .where('favoriteMovies.id', id)
                    .distinct('user.*');

                // Envoyer les notifications aux utilisateurs concernés
                if (users.length > 0) {
                    await mailService.sendMovieUpdateNotification(users, updatedMovie, changes);
                }
            }
        } catch (error) {
            console.error('Failed to send movie update notifications:', error);
            // On continue même si l'envoi des notifications échoue
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
        
        // Vérifier si le film existe
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
            .where('user.id', userId);
            
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
