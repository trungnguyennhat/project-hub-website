// class con của Error, tạo ra object của AppError có 4 tham số: message (string), statusCode (number), isOperational (boolean), stack (string)
// khi tạo object, sẽ nhận vào 2 tham số: message (string), statusCode (number)
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
