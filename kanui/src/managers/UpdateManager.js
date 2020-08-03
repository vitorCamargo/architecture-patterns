import OneSignalApiShared from "../OneSignalApiShared";
import { SubscriptionStateKind } from '../models/SubscriptionStateKind';
import { NotSubscribedError, NotSubscribedReason } from "../errors/NotSubscribedError";
import MainHelper from '../helpers/MainHelper';
import Database from "../services/Database";
import Log from "../libraries/Log";
import Utils from "../context/shared/utils/Utils";
import { SessionOrigin } from "../models/Session";
import { logMethodCall } from '../utils';
export class UpdateManager {
    constructor(context) {
        this.context = context;
        this.onSessionSent = context.pageViewManager.getPageViewCount() > 1;
    }
    async getDeviceId() {
        const { deviceId } = await Database.getSubscription();
        if (!deviceId) {
            throw new NotSubscribedError(NotSubscribedReason.NoDeviceId);
        }
        return deviceId;
    }
    async createDeviceRecord() {
        return MainHelper.createDeviceRecord(this.context.appConfig.appId);
    }
    async sendPlayerUpdate(deviceRecord) {
        const existingUser = await this.context.subscriptionManager.isAlreadyRegisteredWithOneSignal();
        if (!existingUser) {
            Log.debug("Not sending the update because user is not registered with OneSignal (no device id)");
            return;
        }
        const deviceId = await this.getDeviceId();
        if (!deviceRecord) {
            deviceRecord = await this.createDeviceRecord();
        }
        if (this.onSessionSent) {
            await OneSignalApiShared.updatePlayer(this.context.appConfig.appId, deviceId, Object.assign({ notification_types: SubscriptionStateKind.Subscribed }, deviceRecord.serialize()));
        }
        else {
            await this.sendOnSessionUpdate(deviceRecord);
        }
    }
    // If user has been subscribed before, send the on_session update to our backend on the first page view.
    async sendOnSessionUpdate(deviceRecord) {
        if (this.onSessionSent) {
            return;
        }
        if (!this.context.pageViewManager.isFirstPageView()) {
            return;
        }
        const existingUser = await this.context.subscriptionManager.isAlreadyRegisteredWithOneSignal();
        if (!existingUser) {
            Log.debug("Not sending the on session because user is not registered with OneSignal (no device id)");
            return;
        }
        const deviceId = await this.getDeviceId();
        if (!deviceRecord) {
            deviceRecord = await this.createDeviceRecord();
        }
        if (deviceRecord.subscriptionState !== SubscriptionStateKind.Subscribed &&
            OneSignal.config.enableOnSession !== true) {
            return;
        }
        try {
            // Not sending on_session here but from SW instead.
            // Not awaiting here on purpose
            this.context.sessionManager.upsertSession(deviceId, deviceRecord, SessionOrigin.PlayerOnSession);
            this.onSessionSent = true;
        }
        catch (e) {
            Log.error(`Failed to update user session. Error "${e.message}" ${e.stack}`);
        }
    }
    async sendPlayerCreate(deviceRecord) {
        try {
            const deviceId = await OneSignalApiShared.createUser(deviceRecord);
            if (deviceId) {
                Log.info("Subscribed to web push and registered with OneSignal", deviceRecord, deviceId);
                this.onSessionSent = true;
                // Not awaiting here on purpose
                this.context.sessionManager.upsertSession(deviceId, deviceRecord, SessionOrigin.PlayerCreate);
                return deviceId;
            }
            Log.error(`Failed to create user.`);
            return undefined;
        }
        catch (e) {
            Log.error(`Failed to create user. Error "${e.message}" ${e.stack}`);
            return undefined;
        }
    }
    onSessionAlreadyCalled() {
        return this.onSessionSent;
    }
    async sendExternalUserIdUpdate(externalUserId) {
        const deviceId = await this.getDeviceId();
        await OneSignalApiShared.updatePlayer(this.context.appConfig.appId, deviceId, {
            external_user_id: Utils.getValueOrDefault(externalUserId, "")
        });
    }
    async sendOutcomeDirect(appId, notificationIds, outcomeName, value) {
        logMethodCall("sendOutcomeDirect");
        const deviceRecord = await this.createDeviceRecord();
        const outcomeRequestData = {
            app_id: appId,
            id: outcomeName,
            device_type: deviceRecord.deliveryPlatform,
            notification_ids: notificationIds,
            direct: true,
        };
        if (value !== undefined) {
            outcomeRequestData.weight = value;
        }
        await OneSignalApiShared.sendOutcome(outcomeRequestData);
    }
    async sendOutcomeInfluenced(appId, notificationIds, outcomeName, value) {
        logMethodCall("sendOutcomeInfluenced");
        const deviceRecord = await this.createDeviceRecord();
        const outcomeRequestData = {
            app_id: appId,
            id: outcomeName,
            device_type: deviceRecord.deliveryPlatform,
            notification_ids: notificationIds,
            direct: false,
        };
        if (value !== undefined) {
            outcomeRequestData.weight = value;
        }
        await OneSignalApiShared.sendOutcome(outcomeRequestData);
    }
    async sendOutcomeUnattributed(appId, outcomeName, value) {
        logMethodCall("sendOutcomeUnattributed");
        const deviceRecord = await this.createDeviceRecord();
        const outcomeRequestData = {
            app_id: appId,
            id: outcomeName,
            device_type: deviceRecord.deliveryPlatform,
        };
        if (value !== undefined) {
            outcomeRequestData.weight = value;
        }
        await OneSignalApiShared.sendOutcome(outcomeRequestData);
    }
}
//# sourceMappingURL=UpdateManager.js.map