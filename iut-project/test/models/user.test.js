'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Models/User', () => {

    it('user model exists', () => {

        const User = require('../../lib/models/user');

        expect(User).to.exist();
    });
});
