
export type GenerateAuthKeyProps = {
    acess_token: string
}

export type VerifyAuthKeyProps = {
    user_id: string
}

export interface AuthProvider {
    generateAuthKey(user_id: string): GenerateAuthKeyProps
    verifyAuthKey(token: string): VerifyAuthKeyProps
}
