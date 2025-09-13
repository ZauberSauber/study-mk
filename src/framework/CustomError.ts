import { EHttpStatus } from "../types/network";

export default class CustomError {
  public status: EHttpStatus;
  public reason?: string;

  constructor(status: EHttpStatus, reason?: string) {
    this.status = status;
    this.reason = reason;
  }
}
