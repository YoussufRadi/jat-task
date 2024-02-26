import { z } from 'zod';

export enum ResponseStatus {
  Success,
  Failed,
}

export class ServiceResponse<T = null> {
  private _success: boolean;
  public get success(): boolean {
    return this._success;
  }
  public set success(value: boolean) {
    this._success = value;
  }

  private _message: string;
  public get message(): string {
    return this._message;
  }
  public set message(value: string) {
    this._message = value;
  }

  _responseObject: T;
  public get responseObject(): T {
    return this._responseObject;
  }
  public set responseObject(value: T) {
    this._responseObject = value;
  }

  private _statusCode: number;
  public get statusCode(): number {
    return this._statusCode;
  }
  public set statusCode(value: number) {
    this._statusCode = value;
  }

  constructor(status: ResponseStatus, message: string, responseObject: T, statusCode: number) {
    this._success = status === ResponseStatus.Success;
    this._message = message;
    this._responseObject = responseObject;
    this._statusCode = statusCode;
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.optional(),
    statusCode: z.number(),
  });
