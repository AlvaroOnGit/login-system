import z from 'zod'

const passwordSchema = z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .refine(password => /[A-Z]/.test(password), {
        message: 'Password must contain an uppercase letter.'
    })
    .refine(password => /[a-z]/.test(password), {
        message: 'Password must contain a lowercase letter.'
    })
    .refine(password => /[0-9]/.test(password), {
        message: 'Password must contain a number.'
    })
    .refine(password => /[!@#$%^&*]/.test(password), {
        message: 'Password must contain a symbol.'
    })

const loginSchema = z.object({
    email: z.email({message: 'Invalid email format'}),
    password: passwordSchema
})

const userSchema = z.object({

    username: z.string().min(3, {message: 'Username must be at least 3 characters long.'}),
    email: z.email({message: 'Invalid email format'}),
    password: passwordSchema,

});

export function validateLogin (object) {
    return loginSchema.safeParse(object);
}

export function validatePassword (password) {
    return passwordSchema.safeParse(password);
}

export function validateUser (object) {
    return userSchema.safeParse(object);
}