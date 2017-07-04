var connectionPool = require('../database_help/connection_pool');

/**
 * Model for authentication business logic. Contains functionality for authenticating or logging a user in, logging out, and signing up.
 */
export class AuthenticationModel {

    constructor() {

    }

    public authenticateAppUser() {
        connectionPool.query('authenticateAppUser').then(res => {

        })
        .catch(err => {

        });
    }

};