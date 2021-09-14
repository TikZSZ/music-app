export interface RegistrationSchema {
  name: string;
  email: string;
  age: string;
  password: string;
  confirmPassword: string;
  country: string;
  tos: {
    is: boolean;
  };
}