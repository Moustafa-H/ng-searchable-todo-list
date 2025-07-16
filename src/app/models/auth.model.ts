export type LoginResponse = {
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
    registered: boolean
}

export type UserType = {
    email: string,
    id: string,
    _token: string,
    _tokenExpirationDate: Date
}

export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date
    ) {}

    get token() {
        if (!this._tokenExpirationDate || this._tokenExpirationDate < new Date()) 
            return null
        
        return this._token
    }
}