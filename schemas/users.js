import z from 'zod'

const userSchema = z.object({

    username: z.string().min(3),
    email: z.string(),
    password: z.string().min(6)

});

export function validateUser (object) {
    return userSchema.safeParse(object);
}