'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Server = require('../../server');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Routes/User', () => {

    it('login fails with invalid credentials', async () => {

        const server = await Server.deployment();

        const loginResponse = await server.inject({
            method: 'POST',
            url: '/user/login',
            payload: {
                email: 'test@test.com',
                password: 'wrongpassword'
            }
        });

        expect(loginResponse.statusCode).to.equal(401);
        expect(loginResponse.result.message).to.equal('Invalid credentials');

        await server.stop();
    });
});
