// Logic for API calls to local user db

import { Pool } from 'pg';

const connection = new Pool();

export class userModel {

    static async getId({ email }) {

        const res = await connection.query(
            'SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]
        )

        if (res.rows.length === 0) return null;

        return res.rows[0].id;
    }

    static async getPassword({ id }) {

        const res = await connection.query(
            'SELECT password FROM users WHERE id = $1',
            [id]
        )

        if (res.rows.length === 0) return null;

        return res.rows[0].password;
    }

    static async userExistsByUsernameOrEmail({ username, email }) {

        try {
            const res = await connection.query(
                'SELECT LOWER(username) = LOWER($1) AS username_match, LOWER(email) = LOWER($2) AS email_match FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)',
                [username, email]
            )
            return res.rows[0] ?? null;

        } catch (e) {
            throw new Error(e);
        }
    }

    static async createUser ({ username, email, password }) {

        try{
            const res = await connection.query(
                'INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
                [username, email, password]
            )
            return res.rows[0];

        } catch(e){
            throw new Error(e);
        }
    }

    static async updateUser({ id, data }) {

    }
}