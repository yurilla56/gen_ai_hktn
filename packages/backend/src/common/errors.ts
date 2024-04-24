export const emptyStringErrorMessage = (prop: string): string =>
  `Property "${prop}" cannot be empty`;

export const stringTypeErrorMessage = (prop: string): string =>
  `Property "${prop}" must be a string`;

export const numberTypeErrorMessage = (prop: string): string =>
  `Property "${prop}" must be a number`;

export const requiredErrorMessage = (prop: string): string =>
  `Property "${prop}" is required`;
