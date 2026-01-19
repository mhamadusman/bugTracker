import { errorCodes } from "../constants/errorCodes";

export class Exception extends Error{
    public readonly statusCode: errorCodes

    constructor(message: string, statusCode: errorCodes){
        super(message)
        this.statusCode = statusCode

        Object.setPrototypeOf(this , Exception.prototype)
    }
}