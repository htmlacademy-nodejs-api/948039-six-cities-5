export const CreateUserValidationMessage = {
  name: {
    invalidFormat: 'Name must be string',
    length: 'Name length must be into range 1 - 15',
  },
  email: {
    invalidEmail: 'Email must be a valid',
  },
  avatar: {
    invalidFormat: 'Avatar must be string',
    invalitType: 'Avatar must be jpg or png format',
  },
  password: {
    length: 'Password length must be into range 6 - 12',
  },
  type: {
    invalitValue: 'Type must be UserTypeEnum value',
  },
} as const;
