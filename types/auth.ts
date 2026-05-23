export interface SendOtpRequest {
  mobile: string;
}

export interface SendOtpResponse {
  success: boolean;
  message?: string;
}

export interface VerifyOtpRequest {
  mobile: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
}

export interface ApiResponse<T> {
  Status: number;
  Message: string;
  ErrorList: string[];
  Data: T;
}

export interface User {
  UserId: string;
  FirstName: string;
  LastName: string;
  Email: string;
  MobileNumber: string;
  Address: string;
  CountryId: number;
  CountryName: string;
  StateId: number;
  StateName: string;
  CityId: number;
  CityName: string;
  PinCode: string;
  GenderName: string;
}

export interface SessionUser {
  mobile: string;
  isAuthenticated: boolean;
}

export type AuthStep = "mobile" | "otp";
