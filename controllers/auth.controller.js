import jwt from "jsonwebtoken";
import {validateLogin, validateUser} from "../schemas/validators.js";
import { PasswordManager } from "../utils/passwordManager.js";

export class AuthController {

    constructor({ userModel }) {
        this.userModel = userModel;
    }

    logUser = async (req, res) => {

        try{
            // Validate user input
            const result = validateLogin(req.body);

            if (!result.success) return res.status(400).json({error: JSON.parse(result.error.message)});
            const { email, password: inputPassword } = result.data

            // Get the user if the email exists
            const user = await this.userModel.getUser({ email })
            if (!user) return res.status(400).json({error: 'User not found'});

            const { id, username, password: hashedPassword } = user

            //Call the PasswordManager to verify the password with the hashed password
            const passwordIsValid = await PasswordManager.verifyPassword(hashedPassword, inputPassword);
            if (!passwordIsValid) return res.status(401).json({error: 'Password does not match'});

            // Create an access token and a refresh token for the user
            const accessToken = jwt.sign(
                { id: id, username: username, email: email },
                process.env.JWT_ACCESS_SECRET_KEY,
                { expiresIn: process.env.JWT_ACCESS_EXPIRES }
            );

            const refreshToken = jwt.sign(
                { id: id, username: username, email: email },
                process.env.JWT_REFRESH_SECRET_KEY,
                { expiresIn: process.env.JWT_REFRESH_EXPIRES }
            );

            // Save the refreshToken on the db as well as its expiration date
            const refreshTokenExpiration = new Date
            (Date.now() + process.env.JWT_REFRESH_TOKEN_LIFETIME * 24 * 60 * 60 *1000);
            await this.userModel.saveRefreshToken({ id, refreshToken, refreshTokenExpiration });

            console.log(`User logged with id: ${id}`);

            return res
                .status(200)
                .cookie('access_token', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000
                })
                .cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                .json({message: 'User logged successfully.'});
       }
       catch (e) {
            console.error(e)
            return res.status(500).json({error: 'Internal server Error'});
       }
    }

    createUser = async (req, res) => {
        // Validate user input
        const result = validateUser(req.body);

        if (!result.success) {
            return res.status(400).json({error: JSON.parse(result.error.message)});
        }

        const { username, email, password } = result.data

        // Check if the username or email already exists
        const userExists = await this.userModel.userExistsByUsernameOrEmail({username, email});

        // Logic if either the username or the email already exists
        if (userExists) {

            const { username_match, email_match } = userExists;

            let message;

            switch (true){
                case username_match && email_match:
                    message = "username-email-match";
                    break;

                case username_match:
                    message = "username-match";
                    break;

                case email_match:
                    message = "email-match";
                    break;
            }

            return res.status(409).json({ message });
        }

        // Call the PasswordManager class to hash the password
        const hashedPassword = await PasswordManager.hashPassword(password);

        if (!hashedPassword) {
            return res.status(400).json({message: "Could not validate password"});
        }

        // Create a new object containing the hashed password
        const hashedData = {
            username: username,
            email: email,
            password: hashedPassword,
        }

        // Create the user on the database
        const newUser = await this.userModel.createUser( hashedData )

        if (!newUser) {
            return res.status(400).json({message: "Could not create a new user"});
        }

        return res.status(201).json(newUser);
    }

    logout = async (req, res) => {
        res
            .status(200)
            .clearCookie('access_token')
            .clearCookie('refresh_token')
            .json({message: 'User logged out'})
    }

    authSession = async (req, res) => {

        const { user } = req.session;

        if (!user) {
            return res.status(400).json({error: 'No user session'});
        }

        res.status(200).json({ user });
    }

    refresh = async (req, res) => {

        // Get the refresh token from the request
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({error: 'Refresh token not found'});
        }

        //Verify the validity of the token on db
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);

        const isTokenValid= await this.userModel.checkRefreshToken({ id: payload.id, refreshToken });

        //If the token is not valid, clear it from cookie
        if (!isTokenValid) {
            return res
                .status(401)
                .clearCookie('refresh_token')
                .json({error: 'Refresh token is invalid'});
        }

        //If the token is valid, create a new access_token
        try {
            const accessToken = jwt.sign(
                { id: payload.id, username: payload.username, email: payload.email },
                process.env.JWT_ACCESS_SECRET_KEY,
                { expiresIn: process.env.JWT_ACCESS_EXPIRES }
            );
            res
                .status(200)
                .cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
                })
                .json({message: 'Token refreshed successfully.'});
        }
        catch (e) {
            res.status(500).json({error: 'Internal server Error'});
        }
    }
}