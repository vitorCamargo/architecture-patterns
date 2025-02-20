import PushPermissionNotGrantedError from '../errors/PushPermissionNotGrantedError';
import { PushPermissionNotGrantedErrorReason } from '../errors/PushPermissionNotGrantedError';
import { WindowEnvironmentKind } from '../models/WindowEnvironmentKind';
import EventHelper from './EventHelper';
import { InvalidStateError, InvalidStateReason } from '../errors/InvalidStateError';
import { NotificationPermission } from '../models/NotificationPermission';
import { RawPushSubscription } from '../models/RawPushSubscription';
import Log from '../libraries/Log';
import SdkEnvironment from '../managers/SdkEnvironment';
import { PermissionUtils } from "../utils/PermissionUtils";
import LocalStorage from '../utils/LocalStorage';
import { SessionOrigin } from "../models/Session";
import MainHelper from "./MainHelper";
import PageServiceWorkerHelper from "./page/ServiceWorkerHelper";
import { Browser } from "../context/browser/models/Browser";
export default class SubscriptionHelper {
    static async registerForPush() {
        const isPushEnabled = LocalStorage.getIsPushNotificationsEnabled();
        return await SubscriptionHelper.internalRegisterForPush(isPushEnabled);
    }
    static async internalRegisterForPush(isPushEnabled) {
        const context = OneSignal.context;
        let subscription = null;
        /*
          Within the same page navigation (the same session), do not register for
          push if the user is already subscribed, otherwise the user will have its
          session count incremented on each page refresh. However, if the user is
          not subscribed, subscribe.
        */
        if (isPushEnabled && !context.pageViewManager.isFirstPageView()) {
            Log.debug('Not registering for push because the user is subscribed and this is not the first page view.');
            Log.debug("But we want to rekindle their session.");
            const deviceId = await MainHelper.getDeviceId();
            if (deviceId) {
                const deviceRecord = await MainHelper.createDeviceRecord(OneSignal.config.appId, true);
                await OneSignal.context.sessionManager.upsertSession(deviceId, deviceRecord, SessionOrigin.PageRefresh);
            }
            else {
                Log.error("Should have been impossible to have push as enabled but no device id.");
            }
            return null;
        }
        if (typeof OneSignal !== "undefined") {
            if (OneSignal._isRegisteringForPush)
                return null;
            else
                OneSignal._isRegisteringForPush = true;
        }
        switch (SdkEnvironment.getWindowEnv()) {
            case WindowEnvironmentKind.Host:
            case WindowEnvironmentKind.OneSignalSubscriptionModal:
                try {
                    const rawSubscription = await context.subscriptionManager.subscribe(0 /* ResubscribeExisting */);
                    subscription = await context.subscriptionManager.registerSubscription(rawSubscription);
                    context.pageViewManager.incrementPageViewCount();
                    await PermissionUtils.triggerNotificationPermissionChanged();
                    await EventHelper.checkAndTriggerSubscriptionChanged();
                }
                catch (e) {
                    Log.info(e);
                }
                break;
            case WindowEnvironmentKind.OneSignalSubscriptionPopup:
                /*
                  This is the code for the HTTP popup.
                 */
                const windowCreator = opener || parent;
                let rawSubscription;
                // Update the stored permission first, so we know the real value even if the user closes the
                // popup
                await context.permissionManager.updateStoredPermission();
                try {
                    /* If the user doesn't grant permissions, a PushPermissionNotGrantedError will be thrown here. */
                    rawSubscription = await context.subscriptionManager.subscribe(1 /* SubscribeNew */);
                    // Update the permission to granted
                    await context.permissionManager.updateStoredPermission();
                }
                catch (e) {
                    // Update the permission to denied or default
                    await context.permissionManager.updateStoredPermission();
                    if (e instanceof PushPermissionNotGrantedError) {
                        switch (e.reason) {
                            case PushPermissionNotGrantedErrorReason.Blocked:
                                await context.permissionManager.updateStoredPermission();
                                /* Force update false, because the iframe installs a native
                                permission change handler that will be triggered when the user
                                clicks out of the popup back to the parent page */
                                OneSignal.subscriptionPopup.message(OneSignal.POSTMAM_COMMANDS.REMOTE_NOTIFICATION_PERMISSION_CHANGED, {
                                    permission: NotificationPermission.Denied,
                                    forceUpdatePermission: false
                                });
                                break;
                            case PushPermissionNotGrantedErrorReason.Dismissed:
                                /* Force update true because default permissions (before
                                prompting) -> default permissions (after prompting) isn't a
                                change, but we still want to be notified about it */
                                OneSignal.subscriptionPopup.message(OneSignal.POSTMAM_COMMANDS.REMOTE_NOTIFICATION_PERMISSION_CHANGED, {
                                    permission: NotificationPermission.Default,
                                    forceUpdatePermission: true
                                });
                                break;
                        }
                    }
                    /*
                      Popup native permission request was blocked or dismissed
                      Close the window
                    */
                    if (windowCreator) {
                        window.close();
                        return null;
                    }
                }
                OneSignal.subscriptionPopup.message(OneSignal.POSTMAM_COMMANDS.FINISH_REMOTE_REGISTRATION, {
                    rawPushSubscription: rawSubscription.serialize()
                }, (message) => {
                    if (message.data.progress === true) {
                        Log.debug('Got message from host page that remote reg. is in progress, closing popup.');
                        if (windowCreator) {
                            window.close();
                        }
                    }
                    else {
                        Log.debug('Got message from host page that remote reg. could not be finished.');
                    }
                });
                break;
            default:
                if (typeof OneSignal !== "undefined")
                    OneSignal._isRegisteringForPush = false;
                throw new InvalidStateError(InvalidStateReason.UnsupportedEnvironment);
        }
        if (typeof OneSignal !== "undefined")
            OneSignal._isRegisteringForPush = false;
        return subscription;
    }
    static getRawPushSubscriptionForSafari(safariWebId) {
        const subscription = new RawPushSubscription();
        const { deviceToken: existingDeviceToken } = window.safari.pushNotification.permission(safariWebId);
        subscription.existingSafariDeviceToken = existingDeviceToken;
        return subscription;
    }
    static async getRawPushSubscriptionFromServiceWorkerRegistration() {
        const registration = await PageServiceWorkerHelper.getRegistration();
        if (!registration) {
            return null;
        }
        const swSubscription = await registration.pushManager.getSubscription();
        if (!swSubscription) {
            return null;
        }
        return RawPushSubscription.setFromW3cSubscription(swSubscription);
    }
    static async getRawPushSubscriptionWhenUsingSubscriptionWorkaround() {
        // we would need to message service worker to get it. we'll get it from inside if necessary
        return null;
    }
    static async getRawPushSubscription(environmentInfo, safariWebId) {
        if (environmentInfo.browserType === Browser.Safari) {
            return SubscriptionHelper.getRawPushSubscriptionForSafari(safariWebId);
        }
        if (environmentInfo.isUsingSubscriptionWorkaround) {
            return SubscriptionHelper.getRawPushSubscriptionWhenUsingSubscriptionWorkaround();
        }
        if (environmentInfo.isBrowserAndSupportsServiceWorkers) {
            return await SubscriptionHelper.getRawPushSubscriptionFromServiceWorkerRegistration();
        }
        return null;
    }
}
//# sourceMappingURL=SubscriptionHelper.js.map