import { EHttpStatus } from "../constants";

export class ApiException<T = any> {
  public httpCode?: number;
  public businessCode?: number = -1;
  public message?: string;
  public errors?: T;
  public type: string;

  constructor(
    message: string,
    httpCode: number = EHttpStatus.INTERNAL_SERVER_ERROR,
    errors?: T,
    type: string = "DEFAULT",
    businessCode: number = -1
  ) {
    this.httpCode = httpCode;
    this.message = message;
    this.type = type;
    this.businessCode = businessCode;
    this.errors = errors;
  }
}
