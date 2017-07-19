//currently just checks if email contains an @
export function isValidEmail(email: string): boolean {
    var length = email.length;
    for(var i = 0; i < length; i++) {
    if(email[i] == '@')
        return true;
    }
    return false;
}

export function isValidPassword(password: string): boolean {
    var length = password.length;
    var HasUpper = false;       
    if(length > 5){
        return true;
    }
    return false;
}
