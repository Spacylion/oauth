export type UserInfoType = {
    id: string
    picture: string
    name: string
    access_token?: string | null
    refresh_token?: string
    expires_at?: number
    provider: string
}