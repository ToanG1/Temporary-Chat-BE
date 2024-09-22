export interface ICreateUserRequest {
  email: string;
  name: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
