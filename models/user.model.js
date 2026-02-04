// Logic for API calls to local user db

import { Pool } from 'pg';

const connection = new Pool();

export class userModel {

    static async getUser({ email }) {
        const res = await connection.query(
            'SELECT id, username, email, password FROM users WHERE email = $1',
            [email]
        )

        if (res.rows.length === 0) return null;

        return res.rows[0];
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

    static async saveRefreshToken({ id, refreshToken, refreshTokenExpiration }) {

        const res = await connection.query(
            'UPDATE users SET refresh_token = $1, token_expiration = $2 WHERE id = $3 RETURNING refresh_token',
            [refreshToken, refreshTokenExpiration, id]
        )
        if (res.rows.length === 0) return null;

        return res.rows[0];
    }

    static async checkRefreshToken({ id, refreshToken }) {

        const res = await connection.query(
            'SELECT id, refresh_token, token_expiration FROM users WHERE id = $1',
            [id]
        )

        if (res.rows.length === 0) return false;

        let {
            refresh_token : dbRefreshToken,
            token_expiration: dbTokenExpiration,
        } = res.rows[0]

        dbTokenExpiration = new Date(dbTokenExpiration).getTime()

        if (dbRefreshToken !== refreshToken || dbTokenExpiration < Date.now()) {
            await this.clearRefreshToken({ id });
            return false;
        }

        return true;
    }

    static async clearRefreshToken({ id }) {
        await connection.query(
            'UPDATE users SET refresh_token = NULL , token_expiration = NULL WHERE id = $1',
            [id]
        )
    }

    static async updateUser({ id, data }) {

    }
}