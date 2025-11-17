// Centralized test data interfaces for reuse across specs
// Keeping interfaces in a dedicated file minimizes duplication and clarifies data contracts.

export interface LoginData {
  username: string;
  password: string;
  expectedMessage: string;
}

export interface UserData {
  username: string;
  password: string;
  expectedAction: string;
}
