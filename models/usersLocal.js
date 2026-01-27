// Logic to access a local database

import { Pool } from 'pg';

const connection = new Pool();

export class userModel {

    static async getByUsername({ username }) {

        const res = await connection.query(
            'SELECT username FROM users WHERE LOWER(username) = LOWER($1)', [username]
        )

        return res.rows[0] ?? null;
    }

    static async userExistsByUsernameOrEmail({ username, email }) {

        try {
            const res = await connection.query(
                'SELECT LOWER(username) = LOWER($1) AS username_match, LOWER(email) = LOWER($2) AS email_match FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)',
                [username, email]
            )
            return res.rows[0] ?? null;
        }
        catch (e) {
            throw new Error(e);
        }
    }

    static async createUser ({ data }) {

    }

    static async updateUser({ id, data }) {

    }
}