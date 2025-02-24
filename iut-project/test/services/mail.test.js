'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Services/Mail', () => {

    it('mail service exists', async () => {

        const Server = require('../../server');

        const server = await Server.deployment();

        const mailService = server.services().mailService;
        expect(mailService).to.exist();

        await server.stop();
    });
});
