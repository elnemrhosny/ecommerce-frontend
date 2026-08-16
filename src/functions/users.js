export const validatePasswordChange = form =>{
    const {new_password , confirm_password} = form;
    let valid = true;
    let match = false;
     if (new_password.length < 8) valid = false;
  if (!/[a-z]/.test(new_password)) valid = false;
  if (!/[A-Z]/.test(new_password)) valid = false;
  if (!/\d/.test(new_password))valid = false;
  if (!/[@$!%*?&]/.test(new_password)) valid = false;
  if(new_password === confirm_password) match = true;
  return {valid , match}
}

export const validatePassword = password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
export const validateName = name => name.trim().length >= 3;
export const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
