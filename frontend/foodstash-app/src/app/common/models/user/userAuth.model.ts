import {Gender} from '../profile/profile.model';

export interface UserLogin {
  email: string,
  password: string
}

export interface UserRegister {
  email: string,
  password: string,
  name: string,
  surname: string,
  birthDate: Date,
  gender: Gender['value']
}
