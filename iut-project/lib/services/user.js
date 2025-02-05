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

        const roles = user.roles || [];
        if (roles.includes('admin') && !roles.includes('user')) {
            roles.push('user');
        }

        console.log('User roles:', roles);

        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                email: user.email,
                id: user.id,
                scope: roles
            },
            {
                key: process.env.JWT_SECRET || 'secret',
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400
            }
        );

        return token;
    }
};
