export class InvalidActivationHash extends Error {
  constructor(message: string) {
    super(message);
  }
}
