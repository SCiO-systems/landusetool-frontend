export const validatePassword = (password, passwordConfirm) =>
  password === passwordConfirm && password.length > 8;
export const validateName = (name) => name.length > 0;
