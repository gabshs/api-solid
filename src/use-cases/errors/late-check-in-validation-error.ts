export class LateCheckInValidationError extends Error {
  constructor() {
    super(
      'The check-in only can only be validated until 20 minutes of its creation.',
    )
  }
}
