
export const validateName = (name: string): string | null => {
  const regex = /^[A-ZА-ЯЁ][a-zа-яё-]*$/;
  if (!name) {
    return `Поле обязательно для заполнения`;
  }

  if (!regex.test(name)) {
    return `Поле должно начинаться с заглавной буквы, содержать только буквы или дефис, без пробелов, цифр и спецсимволов`;
  }

  return null;
};

export const validateLogin = (login: string): string | null => {
  if (!login) {
    return "Логин обязателен для заполнения";
  }

  if (login.length < 3 || login.length > 20) {
    return "Логин должен быть от 3 до 20 символов";
  }

  if (!/^[a-zA-Z]/.test(login)) {
    return "Логин должен начинаться с буквы";
  }

  if (/^\d+$/.test(login)) {
    return "Логин не может состоять только из цифр";
  }

  if (!/^[a-zA-Z0-9_-]*$/.test(login)) {
    return "Логин может содержать только латинские буквы, цифры, дефис и нижнее подчёркивание";
  }

  if (/\s/.test(login)) {
    return "Логин не должен содержать пробелов";
  }

  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email обязателен для заполнения";
  }

  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/;

  if (!regex.test(email)) {
    return "Email должен быть на латинице, может содержать цифры и символы (.-_), должен включать @ и точку после неё, перед точкой должны быть буквы";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Пароль обязателен для заполнения";
  }

  if (password.length < 8 || password.length > 40) {
    return "Пароль должен быть от 8 до 40 символов";
  }

  if (!/[A-Z]/.test(password)) {
    return "Пароль должен содержать хотя бы одну заглавную букву";
  }

  if (!/\d/.test(password)) {
    return "Пароль должен содержать хотя бы одну цифру";
  }

  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return "Телефон обязателен для заполнения";
  }

  const regex = /^\+?[0-9]{10,15}$/;
  if (!regex.test(phone)) {
    return "Телефон должен состоять из 10–15 цифр и может начинаться с плюса";
  }

  return null;
};

export const validateMessage = (message: string): string | null => {
  if (!message || message.trim() === "") {
    return "Сообщение не может быть пустым";
  }
  
  return null;
};

export type TValidateType = "name" | "login" | "email" | "password" | "phone" | "message";

export type TValidateData = {
  validateType?: TValidateType;
  value: string;
  fieldName: string;
};

export const validate = (data: TValidateData[]) => {
  const errors = data.reduce((acc, { validateType, value, fieldName }) => {
    let fieldError = null;

    if (validateType === "message") {
      fieldError = validateMessage(value);
    }

    if (validateType === "login") {
      fieldError = validateLogin(value);
    }

    if (validateType === "email") {
      fieldError = validateEmail(value);
    }

    if (validateType === "password") {
      fieldError = validatePassword(value);
    }

    if (validateType === "phone") {
      fieldError = validatePhone(value);
    }

    if (validateType === "name") {
      fieldError = validateName(value);
    }

    if (fieldError) {
      acc.push({ [fieldName]: fieldError });
    }
      
    return acc;
    
  }, [] as { [key: string]: string }[]);

  return errors;
};
