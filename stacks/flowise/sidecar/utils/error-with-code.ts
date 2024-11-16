export class ErrorWithCode extends Error {
  code!: number;

  constructor(message: string, options: { cause?: unknown; code: number }) {
    super(message, options);
    this.code = options.code;
  }
}
