import User from "../models/User.js"
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from "bcrypt";

passport.use(
    new LocalStrategy({ usernameField: 'email' },async (email, password, done) => {

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: `User with email ${email} is not found!` });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch (err) {
            done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


export default passport;