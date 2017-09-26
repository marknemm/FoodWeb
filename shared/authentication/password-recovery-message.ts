/**
 * Request message format for password recovery.
 */
export class RecoverPasswordRequest {

    constructor(
        public email: string
    ) { }
}
