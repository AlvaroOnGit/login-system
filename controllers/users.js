import { validateUser } from "../schemas/validators.js";


export class UserController {

    constructor({ userModel }) {
        this.userModel = userModel;
    }

    logUser = async (req, res) => {

    }

    createUser = async (req, res) => {

        // Validate user input
        const result = validateUser(req.body);

        if (!result.success) {
            return res.status(400).json({error: JSON.parse(result.error.message)});
        }

        const { username, email } = result.data

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

        // Create the user on the database
        const newUser = await this.userModel.createUser({data: result.data })
    }

}