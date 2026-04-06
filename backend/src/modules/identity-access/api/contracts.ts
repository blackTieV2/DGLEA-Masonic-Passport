export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthRefreshRequest {
  refreshToken: string;
}

export interface AuthSessionResponse {
  accessToken: string;
  refreshToken: string;
  expiresAtIso: string;
  currentUser: {
    userId: string;
    email: string;
    displayName: string;
    status: string;
    roles: string[];
    scopes: {
      lodges: string[];
      districts: string[];
      assignedMemberUserIds: string[];
    };
    capabilities: string[];
  };
}

export interface CurrentUserResponse {
  userId: string;
  email: string;
  displayName: string;
  status: string;
  roles: string[];
  scopes: {
    lodges: string[];
    districts: string[];
    assignedMemberUserIds: string[];
  };
  capabilities: string[];
}
