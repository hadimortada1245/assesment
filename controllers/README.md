>>User Registration

=>User trys to registre
=>We check if data is valid or not
=>We send an email to verify the registration by nodemailer ==> GET //http://localhost:5000/auth/verify-email/ourCode

==> POST ## http://localhost:5000/auth/register ##

{
    "email":"",
    "name":"",
    "password":""
}

>>User Login

=>User trys to login
=>User can't login if the emailVerified attribute is false
=>We create jwt on success

==> POST ## http://localhost:5000/auth/login ##

{
    "email":"",
    "password":""
}

>>Create User

=>We have a middleware to secure creating users 
=>Only if the role is admin we have progress
=>We must pass the token in the headers /Barear token/
=>Auto verifying to make thing easier in our system

==> POST ## http://localhost:5000/admin/create-user ##

{
    "email":"",
    "name":"",
    "password":""
}

>>Passowrd Management

=>The user request to reset the passowrd by sending his email
=>We create an OTP and send it via email to the user 
=>We hash that OTP and save to our database 
=>The user send the OTP +email + newPassword 
=>We search for the email and the expiration of the OTP then we compare the OTP
=>If true we update the password 

==> POST ## http://localhost:5000/auth/forget-password ##

{
    "email":""
}

==> POST ## http://localhost:5000/auth/reset-password ##

{
    "email":"",
    "otp":"",
    "newPassword":""
}

>>Oauth

=>We check if the user exists to login
=>If not we create new user with auto verified email to be true
=>We check passportJs documentation to copy their config
=>We bring id and secret from each website after creating accounts and setting the redirected url
=>We set the data in our config

==>GET
## http://localhost:5000/auth/github ##
## http://localhost:5000/auth/github/callback ##
## http://localhost:5000/auth/linkedin ##
## http://localhost:5000/auth/linkedin/callback ##
## http://localhost:5000/auth/facebook ##
## http://localhost:5000/auth/facebook/callback ##
## http://localhost:5000/auth/google ##
## http://localhost:5000/auth/google/callback ##