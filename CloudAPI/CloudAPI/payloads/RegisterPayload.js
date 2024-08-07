module.exports = {
    type: 'object',
    properties: {
        username: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        name: {
            type: 'string'
        }
    },
    required: [
        'username',
        'password',
        'name'
    ],
    additionalProperties: false
};