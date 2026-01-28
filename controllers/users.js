import { validateUser } from "../schemas/validators.js";
import { PasswordManager } from "../utils/passwordManager.js";


export class UserController {

    constructor({ userModel }) {
        this.userModel = userModel;
    }

    logUser = async (req, res) => {
        // Validate user input
        const result = validateUser(req.body);

        if (!result.success) {
            return res.status(400).json({error: JSON.parse(result.error.message)});
        }

        const { email, password } = result.data
        // Get the user id if the email exists
        const userId = await this.userModel.getId({ email })

        if (!userId) {
            return res.status(400).json({message: 'User not found'});
        }
        //Get the hashed password from the user id
        const hashedPassword = await this.userModel.getPassword({ id: userId })
        //Call the PasswordManager to verify the password with the hashed password
        const passwordIsValid = await PasswordManager.verifyPassword(hashedPassword, password)

        if (!passwordIsValid) {
            return res.status(401).json({message: 'Password does not match'});
        }
        return res.status(200).json({message: 'Successfully logged in'});
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
                    message = "Username & email already in use";
                    break;

                case username_match:
                    message = "Username already in use";
                    break;

                case email_match:
                    message = "Email already in use";
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

}