class LocalStorageManager {
    constructor() {
        this.constants = {
            'TOKEN_KEY': 'Token',
            'ID_KEY': 'Id',
            'EMAIL_KEY': 'Email',
            'AUTHORITIES_KEY': 'Authorities'
        }
    }
    saveToken(token) {
        window.localStorage.removeItem(this.constants.TOKEN_KEY)
        window.localStorage.setItem(this.constants.TOKEN_KEY, token)
    }
    saveId(id) {
        window.localStorage.removeItem(this.constants.ID_KEY)
        window.localStorage.setItem(this.constants.ID_KEY, id)
    }
    saveEmail(email) {
        window.localStorage.removeItem(this.constants.EMAIL_KEY)
        window.localStorage.setItem(this.constants.EMAIL_KEY, email)
    }
    saveAuthorities(authorities) {
        window.localStorage.removeItem(this.constants.AUTHORITIES_KEY)
        window.localStorage.setItem(this.constants.AUTHORITIES_KEY, JSON.stringify(authorities))
    }
    signOut() {localStorage.clear()}
    getToken() {return localStorage.getItem(this.constants.TOKEN_KEY)}
    getId() {return localStorage.getItem(this.constants.ID_KEY)}
    getEmail() {return localStorage.getItem(this.constants.EMAIL_KEY)}
    getAuthorities() {return localStorage.getItem(this.constants.AUTHORITIES_KEY)}
}