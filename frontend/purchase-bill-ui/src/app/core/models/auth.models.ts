export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  username?: string;
  locations: LocationDetail[];
}

export interface LocationDetail {
  id: number;
  locationCode: string;
  locationName: string;
  userEmail: string;
}
