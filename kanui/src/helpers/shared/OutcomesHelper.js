import { OutcomeAttributionType } from '../../models/Outcomes';
import Database from "../../services/Database";
import Log from "../../libraries/Log";
import { Utils } from "../../context/shared/utils/Utils";
import { logMethodCall, awaitOneSignalInitAndSupported } from '../../utils';
const SEND_OUTCOME = "sendOutcome";
const SEND_UNIQUE_OUTCOME = "sendUniqueOutcome";
export default class OutcomesHelper {
    /**
     * @param  {string} appId
     * @param  {OutcomesConfig} config - refers specifically to outcomes config
     * @param  {boolean} isUnique
     * @param  {string} outcomeName
     */
    constructor(appId, config, outcomeName, isUnique) {
        this.outcomeName = outcomeName;
        this.config = config;
        this.appId = appId;
        this.isUnique = isUnique;
    }
    /**
     * Returns `OutcomeAttribution` object which includes
     *    1) attribution type
     *    2) notification ids
     *
     * Note: this just looks at notifications that fall within the attribution window and
     *       does not check if they have been previously attributed (used in both sendOutcome & sendUniqueOutcome)
     * @returns Promise
     */
    async getAttribution() {
        return await OutcomesHelper.getAttribution(this.config);
    }
    /**
     * Performs logging of method call and returns whether Outcomes are supported
     * @param  {boolean} isUnique
     * @returns Promise
     */
    async beforeOutcomeSend() {
        const outcomeMethodString = this.isUnique ? SEND_UNIQUE_OUTCOME : SEND_OUTCOME;
        logMethodCall(outcomeMethodString, this.outcomeName);
        if (!this.config) {
            Log.debug("Outcomes feature not supported by main application yet.");
            return false;
        }
        if (!this.outcomeName) {
            Log.error("Outcome name is required");
            return false;
        }
        await awaitOneSignalInitAndSupported();
        const isSubscribed = await OneSignal.privateIsPushNotificationsEnabled();
        if (!isSubscribed) {
            Log.warn("Reporting outcomes is supported only for subscribed users.");
            return false;
        }
        return true;
    }
    /**
     * Returns array of notification ids outcome is currently attributed with
     * @param  {string} outcomeName
     * @returns Promise
     */
    async getAttributedNotifsByUniqueOutcomeName() {
        const sentOutcomes = await Database.getAll("SentUniqueOutcome");
        return sentOutcomes
            .filter(o => o.outcomeName === this.outcomeName)
            .reduce((acc, curr) => {
            const notificationIds = curr.notificationIds || [];
            return [...acc, ...notificationIds];
        }, []);
    }
    /**
     * Returns array of new notifications that have never been attributed to the outcome
     * @param  {string} outcomeName
     * @param  {string[]} notificationIds
     */
    async getNotifsToAttributeWithUniqueOutcome(notificationIds) {
        const previouslyAttributedArr = await this.getAttributedNotifsByUniqueOutcomeName();
        return notificationIds.filter(id => (previouslyAttributedArr.indexOf(id) === -1));
    }
    shouldSendUnique(outcomeAttribution, notifArr) {
        // we should only send if type is unattributed OR there are notifs to attribute
        if (outcomeAttribution.type === OutcomeAttributionType.Unattributed) {
            return true;
        }
        return notifArr.length > 0;
    }
    async saveSentUniqueOutcome(newNotificationIds) {
        const outcomeName = this.outcomeName;
        const existingSentOutcome = await Database.get("SentUniqueOutcome", outcomeName);
        const currentSession = await Database.getCurrentSession();
        const existingNotificationIds = !!existingSentOutcome ? existingSentOutcome.notificationIds : [];
        const notificationIds = [...existingNotificationIds, ...newNotificationIds];
        const timestamp = currentSession ? currentSession.startTimestamp : null;
        await Database.put("SentUniqueOutcome", {
            outcomeName,
            notificationIds,
            sentDuringSession: timestamp
        });
    }
    async wasSentDuringSession() {
        const sentOutcome = await Database.get("SentUniqueOutcome", this.outcomeName);
        if (!sentOutcome) {
            return false;
        }
        const session = await Database.getCurrentSession();
        const sessionExistsAndWasPreviouslySent = session && sentOutcome.sentDuringSession === session.startTimestamp;
        const sessionWasClearedButWasPreviouslySent = !session && !!sentOutcome.sentDuringSession;
        return sessionExistsAndWasPreviouslySent || sessionWasClearedButWasPreviouslySent;
    }
    async send(outcomeProps) {
        const { type, notificationIds, weight } = outcomeProps;
        switch (type) {
            case OutcomeAttributionType.Direct:
                if (this.isUnique) {
                    await this.saveSentUniqueOutcome(notificationIds);
                }
                await OneSignal.context.updateManager.sendOutcomeDirect(this.appId, notificationIds, this.outcomeName, weight);
                return;
            case OutcomeAttributionType.Indirect:
                if (this.isUnique) {
                    await this.saveSentUniqueOutcome(notificationIds);
                }
                await OneSignal.context.updateManager.sendOutcomeInfluenced(this.appId, notificationIds, this.outcomeName, weight);
                return;
            case OutcomeAttributionType.Unattributed:
                if (this.isUnique) {
                    if (await this.wasSentDuringSession()) {
                        Log.warn(`(Unattributed) unique outcome was already sent during this session`);
                        return;
                    }
                    await this.saveSentUniqueOutcome([]);
                }
                await OneSignal.context.updateManager.sendOutcomeUnattributed(this.appId, this.outcomeName, weight);
                return;
            default:
                Log.warn("You are on a free plan. Please upgrade to use this functionality.");
                return;
        }
    }
    // statics
    /**
     * Static method: returns `OutcomeAttribution` object which includes
     *    1) attribution type
     *    2) notification ids
     *
     * Note: this just looks at notifications that fall within the attribution window and
     *       does not check if they have been previously attributed (used in both sendOutcome & sendUniqueOutcome)
     * @param  {OutcomesConfig} config
     * @returns Promise
     */
    static async getAttribution(config) {
        /**
         * Flow:
         * 1. check if the url was opened as a result of a notif;
         * 2. if so, send an api call reporting direct notification outcome
         *    (currently takes into account the match strategy selected in the app's settings);
         * 3. else check all received notifs within timeframe from config;
         * 4. send an api call reporting an influenced outcome for each matching notification
         *    respecting the limit from config too;
         * 5. if no influencing notification found, report unattributed outcome to the api.
         */
        /* direct notifications */
        if (config.direct && config.direct.enabled) {
            const clickedNotifications = await Database.getAll("NotificationClicked");
            if (clickedNotifications.length > 0) {
                return {
                    type: OutcomeAttributionType.Direct,
                    notificationIds: [clickedNotifications[0].notificationId]
                };
            }
        }
        /* influencing notifications */
        if (config.indirect && config.indirect.enabled) {
            const timeframeMs = config.indirect.influencedTimePeriodMin * 60 * 1000;
            const beginningOfTimeframe = new Date(new Date().getTime() - timeframeMs);
            const maxTimestamp = beginningOfTimeframe.getTime();
            const allReceivedNotification = await Database.getAll("NotificationReceived");
            Log.debug(`\tFound total of ${allReceivedNotification.length} received notifications`);
            if (allReceivedNotification.length > 0) {
                const max = config.indirect.influencedNotificationsLimit;
                /**
                 * To handle correctly the case when user got subscribed to a new app id
                 * we check the appId on notifications to match the current app.
                 */
                const allReceivedNotificationSorted = Utils.sortArrayOfObjects(allReceivedNotification, (notif) => notif.timestamp, true, false);
                const matchingNotificationIds = allReceivedNotificationSorted
                    .filter(notif => notif.timestamp >= maxTimestamp)
                    .slice(0, max)
                    .map(notif => notif.notificationId);
                Log.debug(`\tTotal of ${matchingNotificationIds.length} received notifications are within reporting window.`);
                // Deleting all unmatched received notifications
                const notificationIdsToDelete = allReceivedNotificationSorted
                    .filter(notif => matchingNotificationIds.indexOf(notif.notificationId) === -1)
                    .map(notif => notif.notificationId);
                notificationIdsToDelete.forEach(id => Database.remove("NotificationReceived", id));
                Log.debug(`\t${notificationIdsToDelete.length} received notifications will be deleted.`);
                if (matchingNotificationIds.length > 0) {
                    return {
                        type: OutcomeAttributionType.Indirect,
                        notificationIds: matchingNotificationIds,
                    };
                }
            }
        }
        /* unattributed outcome report */
        if (config.unattributed && config.unattributed.enabled) {
            return {
                type: OutcomeAttributionType.Unattributed,
                notificationIds: []
            };
        }
        return {
            type: OutcomeAttributionType.NotSupported,
            notificationIds: [],
        };
    }
}
//# sourceMappingURL=OutcomesHelper.js.map