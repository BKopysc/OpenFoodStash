export interface Tokens {
  "access_token" : string,
  "refresh_token": string,
  "roles": string[],
  "username": string,
  "expires_at": string
}

export interface RefreshTokenCall {
  "access_token": string,
  "refresh_token": string
}

export interface StoredUserData {
  "username": string,
  "roles": string[]
}

export enum LocalStorageDataNames {
  "JWT_TOKEN" = "JWT_TOKEN",
  "REFRESH_TOKEN" = "REFRESH_TOKEN",
  "EXPIRES_AT" = "EXPIRES_AT",
  "USER_DATA" = "USER_DATA"
}
