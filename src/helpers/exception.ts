import { errorCodes } from "../constants/errorCodes";
import { ValidationError } from "../types/types";

export class Exception extends Error {
  public readonly statusCode: errorCodes;
  public readonly errors?: ValidationError[];
  constructor(message: string | ValidationError[], statusCode: errorCodes) {
    const baseMessage = Array.isArray(message) ? "Validation Failed" : message
    super(baseMessage);
    this.statusCode = statusCode;
    if (Array.isArray(message)) {
      this.errors = message;
    }

    Object.setPrototypeOf(this, Exception.prototype);
  }
}
