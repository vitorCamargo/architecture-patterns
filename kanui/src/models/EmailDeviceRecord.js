import NotImplementedError from '../errors/NotImplementedError';
import { DeliveryPlatformKind } from './DeliveryPlatformKind';
import { DeviceRecord } from './DeviceRecord';
/**
 * Describes an email device record.
 */
export class EmailDeviceRecord extends DeviceRecord {
    /**
     * @param email Omitting this parameter does not void the record's identifier.
     */
    constructor(email, emailAuthHash, pushDeviceRecordId) {
        super();
        this.email = email;
        this.emailAuthHash = emailAuthHash;
        this.pushDeviceRecordId = pushDeviceRecordId;
        this.deliveryPlatform = DeliveryPlatformKind.Email;
    }
    serialize() {
        const serializedBundle = super.serialize();
        if (this.email) {
            serializedBundle.identifier = this.email;
        }
        if (this.emailAuthHash) {
            serializedBundle.email_auth_hash = this.emailAuthHash;
        }
        if (this.pushDeviceRecordId) {
            serializedBundle.device_player_id = this.pushDeviceRecordId;
        }
        return serializedBundle;
    }
    deserialize(_) { throw new NotImplementedError(); }
}
//# sourceMappingURL=EmailDeviceRecord.js.map