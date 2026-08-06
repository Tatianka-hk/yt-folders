// export function tokenCheck(token: string): void {
//     if (!token) return

//     // const decoded = jwt.decode(token) as { exp?: number } | null
//     const isValid = decoded?.exp ? decoded.exp * 1000 > Date.now() : false

//     if (!isValid) {
//         if (typeof window !== 'undefined') {
//             // window.location.href = "/logout";
//         }
//     }
// }

// export type ApiResponse<T> = { data: T , success: boolean} |

class ApiError extends Error {
    status: number
    details?: any

    constructor(message: string, status: number, details?: any) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.details = details
    }
}

const API_URL = '/api'

export async function apiRequest<T>({
    method,
    url,
    token,
    data,
}: {
    method: string
    url: string
    token?: string
    data?: any
}): Promise<T> {
    // if (token) tokenCheck(token)

    const res = await fetch(`${API_URL}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(data ? { body: JSON.stringify(data) } : {}),
    })

    let json: any
    try {
        json = await res.json()
    } catch {
        json = null
    }

    if (!res.ok) {
        throw new ApiError(
            json?.message || res.statusText || 'Unknown error',
            res.status,
            json
        )
    }

    return json as T
}
