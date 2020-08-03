import { WorkerMessenger } from '../libraries/WorkerMessenger';
import { DynamicResourceLoader } from '../services/DynamicResourceLoader';
import CookieSyncer from '../modules/CookieSyncer';
import { PageViewManager } from '../managers/PageViewManager';
import PermissionManager from '../managers/PermissionManager';
import MetricsManager from '../managers/MetricsManager';
import ContextHelper from "../helpers/ContextHelper";
import { UpdateManager } from "../managers/UpdateManager";
import { PromptsManager } from "../managers/PromptsManager";
import { SessionManager } from "../managers/sessionManager/page/SessionManager";
import TagManager from '../managers/tagManager/page/TagManager';
export default class Context {
    constructor(appConfig) {
        this.appConfig = appConfig;
        if (typeof OneSignal !== "undefined" && !!OneSignal.environmentInfo) {
            this.environmentInfo = OneSignal.environmentInfo;
        }
        this.subscriptionManager = ContextHelper.getSubscriptionManager(this);
        this.serviceWorkerManager = ContextHelper.getServiceWorkerManager(this);
        this.pageViewManager = new PageViewManager();
        this.permissionManager = new PermissionManager();
        this.workerMessenger = new WorkerMessenger(this);
        this.updateManager = new UpdateManager(this);
        this.sessionManager = new SessionManager(this);
        this.tagManager = new TagManager(this);
        this.promptsManager = new PromptsManager(this);
        this.cookieSyncer = new CookieSyncer(this, appConfig.cookieSyncEnabled);
        this.dynamicResourceLoader = new DynamicResourceLoader();
        this.metricsManager = new MetricsManager(appConfig.metrics.enable, appConfig.metrics.mixpanelReportingToken);
    }
}
//# sourceMappingURL=Context.js.map