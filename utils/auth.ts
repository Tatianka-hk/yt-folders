export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password: string): boolean {
    return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)
}
