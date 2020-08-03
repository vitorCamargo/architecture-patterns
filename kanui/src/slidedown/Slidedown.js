import bowser from 'bowser';
import Event from '../Event';
import MainHelper from '../helpers/MainHelper';
import { addCssClass, addDomElement, getPlatformNotificationIcon, once, removeDomElement, removeCssClass, getDomElementOrStub } from '../utils';
import { SERVER_CONFIG_DEFAULTS_SLIDEDOWN } from '../config';
import { getLoadingIndicatorWithColor } from './LoadingIndicator';
import { getRetryIndicator } from './RetryIndicator';
import { SlidedownCssClasses, SlidedownCssIds, COLORS } from "./constants";
import Log from '../../src/libraries/Log';
import { getSlidedownHtml } from './SlidedownHtml';
export default class Slidedown {
    static get EVENTS() {
        return {
            ALLOW_CLICK: 'popoverAllowClick',
            CANCEL_CLICK: 'popoverCancelClick',
            SHOWN: 'popoverShown',
            CLOSED: 'popoverClosed',
        };
    }
    constructor(options) {
        if (!options) {
            options = MainHelper.getSlidedownPermissionMessageOptions(OneSignal.config.userConfig.promptOptions);
        }
        this.options = options;
        this.categoryOptions = options.categories;
        this.options.actionMessage = options.actionMessage.substring(0, 90);
        this.options.acceptButtonText = options.acceptButtonText.substring(0, 15);
        this.options.cancelButtonText = options.cancelButtonText.substring(0, 15);
        this.notificationIcons = null;
        this.isShowingFailureState = false;
        if (!!this.categoryOptions) {
            this.categoryOptions.positiveUpdateButton = this.categoryOptions.positiveUpdateButton.substring(0, 16),
                this.categoryOptions.negativeUpdateButton = this.categoryOptions.negativeUpdateButton.substring(0, 16),
                this.categoryOptions.updateMessage = this.categoryOptions.updateMessage.substring(0, 90),
                // NOTE: will be configurable in the future
                this.categoryOptions.savingButtonText = SERVER_CONFIG_DEFAULTS_SLIDEDOWN.savingText;
            this.categoryOptions.errorButtonText = this.categoryOptions.positiveUpdateButton;
        }
    }
    async create(isInUpdateMode) {
        // TODO: dynamically change btns depending on if its first or repeat display of slidedown (subscribe vs update)
        if (this.notificationIcons === null) {
            const icons = await MainHelper.getNotificationIcons();
            this.notificationIcons = icons;
            // Remove any existing container
            if (this.container.className.includes(SlidedownCssClasses.container)) {
                removeDomElement(`#${SlidedownCssIds.container}`);
            }
            const positiveButtonText = isInUpdateMode && !!this.categoryOptions ?
                this.categoryOptions.positiveUpdateButton : this.options.acceptButtonText;
            const negativeButtonText = isInUpdateMode && !!this.categoryOptions ?
                this.categoryOptions.negativeUpdateButton : this.options.cancelButtonText;
            const messageText = isInUpdateMode && !!this.categoryOptions ?
                this.categoryOptions.updateMessage : this.options.actionMessage;
            const icon = this.getPlatformNotificationIcon();
            const slidedownHtml = getSlidedownHtml({
                messageText,
                icon,
                positiveButtonText,
                negativeButtonText
            });
            // Insert the container
            addDomElement('body', 'beforeend', `<div id="${SlidedownCssIds.container}"` +
                `class="${SlidedownCssClasses.container} ${SlidedownCssClasses.reset}"></div>`);
            // Insert the dialog
            addDomElement(this.container, 'beforeend', `<div id="${SlidedownCssIds.dialog}" class="${SlidedownCssClasses.dialog}">${slidedownHtml}</div>`);
            // Animate it in depending on environment
            addCssClass(this.container, bowser.mobile ? 'slide-up' : 'slide-down');
            // Add click event handlers
            this.allowButton.addEventListener('click', this.onSlidedownAllowed.bind(this));
            this.cancelButton.addEventListener('click', this.onSlidedownCanceled.bind(this));
            Event.trigger(Slidedown.EVENTS.SHOWN);
        }
    }
    async onSlidedownAllowed(_) {
        await Event.trigger(Slidedown.EVENTS.ALLOW_CLICK);
    }
    onSlidedownCanceled(_) {
        Event.trigger(Slidedown.EVENTS.CANCEL_CLICK);
        this.close();
    }
    close() {
        addCssClass(this.container, 'close-slidedown');
        once(this.dialog, 'animationend', (event, destroyListenerFn) => {
            if (event.target === this.dialog &&
                (event.animationName === 'slideDownExit' || event.animationName === 'slideUpExit')) {
                // Uninstall the event listener for animationend
                removeDomElement(`#${SlidedownCssIds.container}`);
                destroyListenerFn();
                Event.trigger(Slidedown.EVENTS.CLOSED);
            }
        }, true);
    }
    /**
     * only used with Category Slidedown
     */
    setSaveState(state) {
        if (!this.categoryOptions) {
            Log.debug("Slidedown private category options are not defined");
            return;
        }
        if (state) {
            // note: savingButtonText is hardcoded in constructor. TODO: pull from config & set defaults for future release
            this.allowButton.innerHTML = this.getIndicatorHolderHtmlWithText(this.categoryOptions.savingButtonText);
            addDomElement(this.buttonIndicatorHolder, 'beforeend', getLoadingIndicatorWithColor(COLORS.whiteLoadingIndicator));
            this.allowButton.disabled = true;
            addCssClass(this.allowButton, 'disabled');
            addCssClass(this.allowButton, SlidedownCssClasses.savingStateButton);
        }
        else {
            // positiveUpdateButton should be defined as written in MainHelper.getSlidedownPermissionMessageOptions
            this.allowButton.innerHTML = this.categoryOptions.positiveUpdateButton;
            removeDomElement(`#${SlidedownCssClasses.buttonIndicatorHolder}`);
            this.allowButton.disabled = false;
            removeCssClass(this.allowButton, 'disabled');
            removeCssClass(this.allowButton, SlidedownCssClasses.savingStateButton);
        }
    }
    setFailureState(state) {
        if (!this.categoryOptions) {
            Log.debug("Slidedown private category options are not defined");
            return;
        }
        if (state) {
            // note: errorButtonText is hardcoded in constructor. TODO: pull from config & set defaults for future release
            this.allowButton.innerHTML = this.getIndicatorHolderHtmlWithText(this.categoryOptions.errorButtonText);
            addDomElement(this.buttonIndicatorHolder, 'beforeend', getRetryIndicator());
            addCssClass(this.allowButton, 'onesignal-error-state-button');
        }
        else {
            removeDomElement('#onesignal-button-indicator-holder');
            removeCssClass(this.allowButton, 'onesignal-error-state-button');
        }
        this.isShowingFailureState = state;
    }
    getPlatformNotificationIcon() {
        return getPlatformNotificationIcon(this.notificationIcons);
    }
    getIndicatorHolderHtmlWithText(text) {
        return `${text}<div id="${SlidedownCssIds.buttonIndicatorHolder}"` +
            `class="${SlidedownCssClasses.buttonIndicatorHolder}"></div>`;
    }
    get container() {
        return getDomElementOrStub(`#${SlidedownCssIds.container}`);
    }
    get dialog() {
        return getDomElementOrStub(`#${SlidedownCssIds.dialog}`);
    }
    get allowButton() {
        return getDomElementOrStub(`#${SlidedownCssIds.allowButton}`);
    }
    get cancelButton() {
        return getDomElementOrStub(`#${SlidedownCssIds.cancelButton}`);
    }
    get buttonIndicatorHolder() {
        return getDomElementOrStub(`#${SlidedownCssIds.buttonIndicatorHolder}`);
    }
    get slidedownFooter() {
        return getDomElementOrStub(`#${SlidedownCssIds.footer}`);
    }
}
export function manageNotifyButtonStateWhileSlidedownShows() {
    const notifyButton = OneSignal.notifyButton;
    if (notifyButton &&
        notifyButton.options.enable &&
        OneSignal.notifyButton.launcher.state !== 'hidden') {
        OneSignal.notifyButton.launcher.waitUntilShown()
            .then(() => {
            OneSignal.notifyButton.launcher.hide();
        });
    }
    OneSignal.emitter.once(Slidedown.EVENTS.CLOSED, () => {
        if (OneSignal.notifyButton &&
            OneSignal.notifyButton.options.enable) {
            OneSignal.notifyButton.launcher.show();
        }
    });
}
//# sourceMappingURL=Slidedown.js.map