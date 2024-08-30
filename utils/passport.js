const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'google', emailVerified: true });
        if (!user) {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            user = new User({ 
                oauthId: profile.id, 
                oauthProvider: 'google', 
                name: profile.displayName || "Google user", 
                email: email,
                emailVerified: true 
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        console.error('Error during Google authentication:', error);
        done(error, null);
    }
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'facebook', emailVerified: true });
        if (!user) {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            user = new User({ 
                oauthId: profile.id, 
                oauthProvider: 'facebook', 
                name: profile.displayName || "Facebook user", 
                email: email,
                emailVerified: true
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        console.error('Error during Facebook authentication:', error);
        done(error, null);
    }
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:  `${process.env.BASE_URL}/auth/github/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'github', emailVerified: true });
        if (!user) {
            user = new User({ 
                oauthId: profile.id, 
                oauthProvider: 'github', 
                name: profile.displayName ||  "Github user",
                emailVerified: true
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        console.error('Error during GitHub authentication:', error);
        done(error, null);
    }
}));

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL:`${process.env.BASE_URL}/auth/linkedin/callback`,
    scope: ['r_emailaddress', 'r_liteprofile']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'linkedin', emailVerified: true });
        if (!user) {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            user = new User({ 
                oauthId: profile.id, 
                oauthProvider: 'linkedin', 
                name: profile.displayName ||  "Linkedin user", 
                email: email,
                emailVerified: true
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        console.error('Error during LinkedIn authentication:', error);
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.error('Error during deserialization:', error);
        done(error, null);
    }
});
