'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class UserService extends Service {

    async create(user) {
        const { User } = this.server.models();
        const { mailService } = this.server.services();

        const newUser = await User.query().insertAndFetch(user);
        
        try {
            await mailService.sendWelcomeEmail(newUser);
        } catch (error) {
            console.error('Failed to send welcome email:', error);
            // On continue même si l'envoi d'email échoue
        }

        return newUser;
    }

    findAll() {
        const { User } = this.server.models();
        return User.query();
    }

    delete(id) {
        const { User } = this.server.models();
        return User.query().deleteById(id);
    }

    update(id, user) {
        const { User } = this.server.models();
        return User.query().findById(id).patch(user);
    }

    async login(email, password) {
        const { User } = this.server.models();
        const user = await User.query().findOne({ email, password });

        if (!user) {
            throw Boom.unauthorized('Invalid credentials');
        }

        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                email: user.email,
                id: user.id
            },
            {
                key: 'random_string',
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );

        return token;
    }
};
