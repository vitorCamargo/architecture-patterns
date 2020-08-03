import OneSignalError from "./OneSignalError";
export var InvalidArgumentReason;
(function (InvalidArgumentReason) {
    InvalidArgumentReason[InvalidArgumentReason["Empty"] = 0] = "Empty";
    InvalidArgumentReason[InvalidArgumentReason["Malformed"] = 1] = "Malformed";
    InvalidArgumentReason[InvalidArgumentReason["EnumOutOfRange"] = 2] = "EnumOutOfRange";
})(InvalidArgumentReason || (InvalidArgumentReason = {}));
export class InvalidArgumentError extends OneSignalError {
    constructor(argName, reason) {
        switch (reason) {
            case InvalidArgumentReason.Empty:
                super(`Supply a non-empty value to '${argName}'.`);
                break;
            case InvalidArgumentReason.Malformed:
                super(`The value for '${argName}' was malformed.`);
                break;
            case InvalidArgumentReason.EnumOutOfRange:
                super(`The value for '${argName}' was out of range of the expected input enum.`);
                break;
        }
        this.argument = argName;
        this.reason = InvalidArgumentReason[reason];
        /**
         * Important! Required to make sure the correct error type is detected during instanceof checks.
         * Same applies to all derived classes.
         * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        Object.setPrototypeOf(this, InvalidArgumentError.prototype);
    }
}
//# sourceMappingURL=InvalidArgumentError.js.map