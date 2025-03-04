'use strict';

module.exports = {
    scheme: 'jwt',
    options: {
        keys: process.env.JWT_SECRET || 'secret',
        verify: {
            aud: 'urn:audience:iut',
            iss: 'urn:issuer:iut',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15
        },
        validate: async (artifacts, request, h) => {
            return {
                isValid: true,
                credentials: {
                    ...artifacts.decoded.payload,
                    scope: artifacts.decoded.payload.scope || []
                }
            };
        }
    }
};
