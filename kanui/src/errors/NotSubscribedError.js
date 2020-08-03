import OneSignalError from "./OneSignalError";
export var NotSubscribedReason;
(function (NotSubscribedReason) {
    NotSubscribedReason[NotSubscribedReason["Unknown"] = 0] = "Unknown";
    NotSubscribedReason[NotSubscribedReason["NoDeviceId"] = 1] = "NoDeviceId";
    NotSubscribedReason[NotSubscribedReason["NoEmailSet"] = 2] = "NoEmailSet";
    NotSubscribedReason[NotSubscribedReason["OptedOut"] = 3] = "OptedOut";
})(NotSubscribedReason || (NotSubscribedReason = {}));
export class NotSubscribedError extends OneSignalError {
    constructor(reason) {
        switch (reason) {
            case NotSubscribedReason.Unknown || NotSubscribedReason.NoDeviceId:
                super('This operation can only be performed after the user is subscribed.');
                break;
            case NotSubscribedReason.NoEmailSet:
                super('No email is currently set.');
                break;
            case NotSubscribedReason.OptedOut:
                super('The user has manually opted out of receiving of notifications. This operation can only be performed after the user is fully resubscribed.');
                break;
        }
        this.reason = NotSubscribedReason[reason];
        /**
         * Important! Required to make sure the correct error type is detected during instanceof checks.
         * Same applies to all derived classes.
         * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        Object.setPrototypeOf(this, NotSubscribedError.prototype);
    }
}
//# sourceMappingURL=NotSubscribedError.js.map