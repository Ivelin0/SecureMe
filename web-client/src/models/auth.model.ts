export interface SignIn {
  username: String;
  password: String;
}

export interface AuthComponent {
  onClose: any & (() => void);
  setSignIn: Function;
}

export interface SignUp extends SignIn {
  confirmPassword: String;
}
