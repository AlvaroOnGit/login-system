// Logic to access a local database

import { Pool } from 'pg';

const connection = new Pool();

export class userModel {

    static async getByUsername({ username }) {

        const res = await connection.query(
            'SELECT id, username FROM users WHERE LOWER(username) = LOWER($1)', [username]
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