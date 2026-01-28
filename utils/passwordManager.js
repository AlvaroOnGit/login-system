import argon2 from 'argon2';
import { validatePassword } from '../schemas/validators.js';

export class PasswordManager {

    static async hashPassword (password) {

        const result = await validatePassword(password);

        if (!result.success) {
            return false;
        }

        try{

            const { data } = result;
            return await argon2.hash(data);

        }
        catch(e){
            throw new Error(e);
        }
    }
}

//const result = await PasswordManager.hashPassword('test1@A');
//console.log(result);