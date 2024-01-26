
    export enum UserRoleEnum {
        admin = "admin",
        readonly = "readonly"
    }
    export type User = {
        id: number,
        login: string,
        password: string,
        age?: number
        role: keyof typeof UserRoleEnum
    }
    export type CreateUserInput = Omit<User, "id">
    export type UpdateUserInput = Partial<Omit<CreateUserInput, "password" | "login" | "role">>
