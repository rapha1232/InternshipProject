import { ApplicationUser } from "@/types";

export type LoginDto = {
  userNameOrEmail: string;
  password: string;
};

export type RegisterDto = {
  userName: string;
  email: string;
  password: string;
};

export type LoginResponseDto = {
  message: string;
  response: {
    jwtToken: string;
    refreshToken: string;
    user: ApplicationUser;
    isLoggedIn: boolean;
    message: string;
    code: number;
  };
};

export type UnauthorizedResponseDto = {
  message: string;
  code: number;
};
export type UnknownErrorDto = {
  message: string;
  err: string;
  code: number;
};

export type RefreshResponseDto = {
  jwtToken: string;
  refreshToken: string;
};
