
// This function validates email addresses for signup. First it checks to see if an '@' and a '.' are present in the correct order.
// Then it checks to see that the '@' is not the first or second character, there is at least a two character gap between '@' and '.',
// and that the '.' is not the last character.
// Returns boolean value.
export function isValidEmail(email: string): boolean {
    var length = email.length;
    var atPos;
    var dotPos;
    var atBeforeDot;
    for (var i = 0; i < length; i++) {
        if (email[i] == '@'){
             atPos = i;
        }     
        if(email[i] == '.'){
            dotPos = i;
        }  
    }
    if(atPos>1 && atPos+1>dotPos && dotPos+1<length){
        return true;
    }
    return false;
}

// This function checks to see if the password length is at least 6, has at least one of each: lowercase, uppercase, digit, and special character.
// Returns boolean value.

export function isValidPassword(password: string): boolean {
    var length = password.length;
    var hasUpper = /[A-Z]/.test(password);
    var hasLower = /[a-z]/.test(password);
    var hasDigit = false;
    var hasSpecial = false;
<<<<<<< HEAD
    var digits = ["0","1","2","3","4","5","6","7","8","9"];
=======
    var digits = ['0','1','2','3','4','5','6','7','8','9'];
>>>>>>> af06ba1772d3990ff270607f9bbc070215a57a6f
    var specials = ['~','!','@','#','%','^','&','*','(',')','_','+'];
    for (var i = 0; i < length; i++) {
        for( var j = 0; j < 10; j++){
            if(password[i] == digits[j]){
                hasDigit = true;
            }
        }
        for( var j = 0; j < 12; j++){
            if(password[i] == specials[j]){
                hasSpecial = true;
            }
        }   
    }
    if (length > 5 && hasUpper && hasLower && hasDigit && hasSpecial) {
        return true;
    }
    return false;
}
