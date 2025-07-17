export interface User {
    id: number,
    username: string,
    email: string,
    role: string,
    password: string,
    is_blocked: boolean,
    created_at: Date
}