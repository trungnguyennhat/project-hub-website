// class con của Error, tạo ra object của AppError nhận 2 tham số đầu vào: message (string), statusCode (number), 
// ngoài ra sẽ có thêm 2 thuộc tính được gán mặc định: isOperational (boolean), stack (string)
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
