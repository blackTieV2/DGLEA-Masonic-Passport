/** Shared validation placeholders. */
export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string[]>;
}

export interface Validator<T> {
  validate(input: T): ValidationResult;
}
