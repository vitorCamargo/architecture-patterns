import SubscriptionHelper from '../../helpers/SubscriptionHelper';
import Context from '../../models/Context';
import ConfigManager from '../../managers/ConfigManager';
import LocalStorage from '../../utils/LocalStorage';
import { EnvironmentInfoHelper } from "../../context/browser/helpers/EnvironmentInfoHelper";
export default class RemoteFrame {
    constructor(initOptions) {
        this.options = {
            appId: initOptions.appId,
            subdomain: initOptions.subdomainName,
            origin: initOptions.origin,
            metrics: {
                enable: false,
                mixpanelReportingToken: null
            },
            userConfig: {}
        };
    }
    /**
     * Loads the messenger on the iFrame to communicate with the host page and
     * assigns init options to an iFrame-only initialization of OneSignal.
     *
     * Our main host page will wait for all iFrame scripts to complete since the
     * host page uses the iFrame onload event to begin sending handshake messages
     * to the iFrame.
     *
     * There is no load timeout here; the iFrame initializes it scripts and waits
     * forever for the first handshake message.
     */
    async initialize() {
        const creator = window.opener || window.parent;
        if (creator == window) {
            document.write(`<span style='font-size: 14px; color: red; font-family: sans-serif;'>OneSignal: This page cannot be directly opened, and must be opened as a result of a subscription call.</span>`);
            return Promise.resolve();
        }
        // The rest of our SDK isn't refactored enough yet to accept typed objects
        // Within this class, we can use them, but when we assign them to
        // OneSignal.config, assign the simple string versions
        const rasterizedOptions = Object.assign({}, this.options);
        rasterizedOptions.appId = rasterizedOptions.appId;
        /* This is necessary, otherwise the subdomain is lost after ConfigManager.getAppConfig */
        rasterizedOptions.subdomainName = rasterizedOptions.subdomain;
        rasterizedOptions.origin = rasterizedOptions.origin;
        OneSignal.config = rasterizedOptions || {};
        const appConfig = await new ConfigManager().getAppConfig(rasterizedOptions);
        OneSignal.environmentInfo = EnvironmentInfoHelper.getEnvironmentInfo();
        OneSignal.context = new Context(appConfig);
        OneSignal.context.workerMessenger.listen(true);
        OneSignal.initialized = true;
        this.loadPromise = {};
        this.loadPromise.promise = new Promise((resolve, reject) => {
            this.loadPromise.resolver = resolve;
            this.loadPromise.rejector = reject;
        });
        this.establishCrossOriginMessaging();
        return this.loadPromise.promise;
    }
    establishCrossOriginMessaging() { }
    dispose() {
        // Removes all events
        this.messenger.destroy();
    }
    finishInitialization() {
        this.loadPromise.resolver();
    }
    async subscribe() {
        // Do not register OneSignalSDKUpdaterWorker.js for HTTP popup sites; the file does not exist
        const isPushEnabled = LocalStorage.getIsPushNotificationsEnabled();
        const windowCreator = opener || parent;
        if (!isPushEnabled) {
            SubscriptionHelper.registerForPush();
        }
        else {
            if (windowCreator) {
                window.close();
            }
        }
    }
}
//# sourceMappingURL=RemoteFrame.js.map