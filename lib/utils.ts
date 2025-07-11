import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Password validation utilities
export const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[A-Z]/, text: "One uppercase letter" },
  { regex: /[a-z]/, text: "One lowercase letter" },
  { regex: /\d/, text: "One number" },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "One special character" },
];

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: number;
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    return {
      isValid: false,
      errors: ["Password is required"],
      strength: 0
    };
  }

  // Check each requirement
  passwordRequirements.forEach((req) => {
    if (!req.regex.test(password)) {
      errors.push(req.text);
    }
  });

  const strength = passwordRequirements.length - errors.length;
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

export function getPasswordStrength(password: string): number {
  return passwordRequirements.filter((req) => req.regex.test(password)).length;
}

export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}
