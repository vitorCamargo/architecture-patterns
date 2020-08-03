export class EmailProfile {
    constructor(emailId, emailAddress, emailAuthHash) {
        this.emailId = emailId;
        this.emailAddress = emailAddress;
        this.emailAuthHash = emailAuthHash;
    }
    serialize() {
        return {
            emailAddress: this.emailAddress,
            emailAuthHash: this.emailAuthHash,
            emailId: this.emailId,
        };
    }
    static deserialize(bundle) {
        return new EmailProfile(bundle.emailId, bundle.emailAddress, bundle.emailAuthHash);
    }
}
//# sourceMappingURL=EmailProfile.js.map