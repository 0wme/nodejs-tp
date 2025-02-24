'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Server = require('../../server');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Routes/Movies', () => {

    it('movies require authentication', async () => {

        const server = await Server.deployment();

        const response = await server.inject({
            method: 'GET',
            url: '/movies'
        });

        expect(response.statusCode).to.equal(401);
        expect(response.result.message).to.equal('Missing authentication');

        await server.stop();
    });
});
