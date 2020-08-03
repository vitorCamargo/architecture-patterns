import { hasCssClass, addCssClass, removeCssClass } from "./utils";
import Log from "./libraries/Log";
export class CustomLink {
    static async initialize(config) {
        if (!config || !config.enabled) {
            return;
        }
        Log.info("Inititalize CustomLink");
        const sdkStylesLoadResult = await OneSignal.context.dynamicResourceLoader.loadSdkStylesheet();
        if (sdkStylesLoadResult !== 0 /* Loaded */) {
            Log.debug('Not initializing custom link button because styles failed to load.');
            return;
        }
        const containerElements = document.querySelectorAll(CustomLink.containerSelector);
        containerElements.forEach((element) => {
            if (!CustomLink.isInitialized(element)) {
                CustomLink.injectMarkup(element, config);
            }
        });
        const isPushEnabled = await OneSignal.privateIsPushNotificationsEnabled();
        const isOptedOut = await OneSignal.internalIsOptedOut();
        const subscribeElements = document.querySelectorAll(CustomLink.subscribeSelector);
        subscribeElements.forEach((element) => CustomLink.initSubscribeElement(element, config, isPushEnabled, isOptedOut));
        const explanationElements = document.querySelectorAll(CustomLink.explanationSelector);
        explanationElements.forEach((element) => CustomLink.initExplanationElement(element, config, isPushEnabled));
    }
    static injectMarkup(container, config) {
        if (!config.text) {
            Log.error("CustomLink: required property 'text' is missing in the config");
            return;
        }
        // Clearing out the contents of the container first
        container.innerHTML = '';
        if (config.text.explanation) {
            const explanation = document.createElement("p");
            addCssClass(explanation, CustomLink.explanationClass);
            container.appendChild(explanation);
        }
        if (config.text.subscribe) {
            const subscribe = document.createElement("button");
            addCssClass(subscribe, CustomLink.subscribeClass);
            container.appendChild(subscribe);
        }
        CustomLink.markAsInitialized(container);
    }
    static initSubscribeElement(element, config, isPushEnabled, isOptedOut) {
        if (config.text && config.text.subscribe) {
            if (!isPushEnabled) {
                element.textContent = config.text.subscribe;
            }
        }
        if (config.text && config.text.unsubscribe) {
            if (isPushEnabled) {
                element.textContent = config.text.unsubscribe;
            }
        }
        CustomLink.setResetClass(element);
        CustomLink.setStateClass(element, isPushEnabled);
        CustomLink.setStyleClass(element, config);
        CustomLink.setSizeClass(element, config);
        CustomLink.setCustomColors(element, config);
        if (config.unsubscribeEnabled !== true) {
            addCssClass(element, "hide");
        }
        element.setAttribute(CustomLink.subscriptionStateAttribute, isPushEnabled.toString());
        element.setAttribute(CustomLink.optedOutAttribute, isOptedOut.toString());
        if (!CustomLink.isInitialized(element)) {
            element.addEventListener("click", () => {
                Log.info("CustomLink: subscribe clicked");
                CustomLink.handleClick(element);
            });
            CustomLink.markAsInitialized(element);
        }
    }
    static async handleClick(element) {
        const state = element.getAttribute(CustomLink.subscriptionStateAttribute) === "true";
        const optedOut = element.getAttribute(CustomLink.optedOutAttribute) === "true";
        if (state) {
            const isPushEnabled = await OneSignal.privateIsPushNotificationsEnabled();
            if (isPushEnabled) {
                await OneSignal.setSubscription(false);
            }
        }
        else {
            if (!optedOut) {
                const autoAccept = !OneSignal.environmentInfo.requiresUserInteraction;
                const options = { autoAccept };
                await OneSignal.registerForPushNotifications(options);
            }
            else {
                await OneSignal.setSubscription(true);
            }
        }
    }
    static initExplanationElement(element, config, isPushEnabled) {
        if (config.text && config.text.explanation) {
            element.textContent = config.text.explanation;
        }
        CustomLink.setResetClass(element);
        CustomLink.setStateClass(element, isPushEnabled);
        CustomLink.setSizeClass(element, config);
        if (config.unsubscribeEnabled !== true) {
            addCssClass(element, "hide");
        }
    }
    // Using stricter HTMLElement class for element parameter to access style property
    static setCustomColors(element, config) {
        if (config.style === "button" && config.color && config.color.button && config.color.text) {
            element.style.backgroundColor = config.color.button;
            element.style.color = config.color.text;
        }
        else if (config.style === "link" && config.color && config.color.text) {
            element.style.color = config.color.text;
        }
    }
    static setStateClass(element, subscribed) {
        const oldClassName = subscribed ? "state-unsubscribed" : "state-subscribed";
        const newClassName = subscribed ? "state-subscribed" : "state-unsubscribed";
        if (hasCssClass(element, oldClassName)) {
            removeCssClass(element, oldClassName);
        }
        if (!hasCssClass(element, newClassName)) {
            addCssClass(element, newClassName);
        }
    }
    static setStyleClass(element, config) {
        if (!config || !config.style) {
            return;
        }
        const newClassName = config.style;
        if (!hasCssClass(element, newClassName)) {
            addCssClass(element, newClassName);
        }
    }
    static setSizeClass(element, config) {
        if (!config || !config.size) {
            return;
        }
        const newClassName = config.size;
        if (!hasCssClass(element, newClassName)) {
            addCssClass(element, newClassName);
        }
    }
    static setResetClass(element) {
        const newClassName = CustomLink.resetClass;
        if (!hasCssClass(element, newClassName)) {
            addCssClass(element, newClassName);
        }
    }
    static markAsInitialized(element) {
        element.setAttribute(CustomLink.initializedAttribute, "true");
    }
    static isInitialized(element) {
        return element.getAttribute(CustomLink.initializedAttribute) === "true";
    }
}
CustomLink.initializedAttribute = "data-cl-initialized";
CustomLink.subscriptionStateAttribute = "data-cl-state";
CustomLink.optedOutAttribute = "data-cl-optedout";
CustomLink.containerClass = "onesignal-customlink-container";
CustomLink.containerSelector = `.${CustomLink.containerClass}`;
CustomLink.subscribeClass = "onesignal-customlink-subscribe";
CustomLink.subscribeSelector = `.${CustomLink.subscribeClass}`;
CustomLink.explanationClass = "onesignal-customlink-explanation";
CustomLink.explanationSelector = `.${CustomLink.explanationClass}`;
CustomLink.resetClass = "onesignal-reset";
export default CustomLink;
//# sourceMappingURL=CustomLink.js.map