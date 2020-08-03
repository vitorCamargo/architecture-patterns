import { addDomElement, removeDomElement, addCssClass, removeCssClass, getDomElementOrStub } from '../utils';
import { getLoadingIndicatorWithColor } from './LoadingIndicator';
import { SlidedownCssIds, TaggingContainerCssClasses, TaggingContainerCssIds, TaggingContainerStrings, COLORS } from './constants';
import TagUtils from '../../src/utils/TagUtils';
export default class TaggingContainer {
    constructor() {
        this.html = "";
    }
    mount(remoteTagCategories, existingPlayerTags) {
        this.html = this.generateHtml(remoteTagCategories, existingPlayerTags);
        const body = getDomElementOrStub(`#${SlidedownCssIds.body}`);
        addDomElement(body, 'beforeend', this.html);
        if (this.taggingContainer) {
            // TODO: is there unmount and remove this listener?
            this.taggingContainer.addEventListener('change', this.toggleCheckedTag);
        }
        const allowButton = getDomElementOrStub(`#${SlidedownCssIds.allowButton}`);
        allowButton.disabled = false;
        removeCssClass(allowButton, 'disabled');
        removeDomElement(`#${TaggingContainerCssClasses.loadingContainer}`);
    }
    load() {
        const loadingContainer = getDomElementOrStub(`#${TaggingContainerCssIds.loadingContainer}`);
        addCssClass(loadingContainer, `${TaggingContainerCssClasses.loadingContainer}`);
        addDomElement(loadingContainer, 'beforeend', getLoadingIndicatorWithColor(COLORS.greyLoadingIndicator));
        addDomElement(loadingContainer, 'beforeend', `<div class="${TaggingContainerCssClasses.loadingMessage}">` +
            `${TaggingContainerStrings.fetchingPreferences}</div>`);
        const allowButton = getDomElementOrStub(`#${SlidedownCssIds.allowButton}`);
        allowButton.disabled = true;
        addCssClass(allowButton, 'disabled');
    }
    generateHtml(remoteTagCategories, existingPlayerTags) {
        const checkedTagCategories = TagUtils.getCheckedTagCategories(remoteTagCategories, existingPlayerTags);
        const firstColumnArr = checkedTagCategories.filter(elem => checkedTagCategories.indexOf(elem) % 2 === 0);
        const secondColumnArr = checkedTagCategories.filter(elem => checkedTagCategories.indexOf(elem) % 2);
        let innerHtml = `<div class="${TaggingContainerCssClasses.taggingContainerCol}">`;
        firstColumnArr.forEach(elem => {
            innerHtml += this.getCategoryLabelHtml(elem);
        });
        innerHtml += "</div>";
        innerHtml += `<div class="${TaggingContainerCssClasses.taggingContainerCol}">`;
        secondColumnArr.forEach(elem => {
            innerHtml += this.getCategoryLabelHtml(elem);
        });
        innerHtml += "</div>";
        return `<div id=${TaggingContainerCssIds.taggingContainer}` +
            ` class="${TaggingContainerCssClasses.taggingContainer}">${innerHtml}</div>`;
    }
    getCategoryLabelHtml(tagCategory) {
        const { label } = tagCategory;
        return `
            <label class="${TaggingContainerCssClasses.categoryLabel}" title="${(label)}">
                <span class="${TaggingContainerCssClasses.categoryLabelText}">${label}</span>
                <input class="${TaggingContainerCssClasses.categoryLabelInput}"
                    type="checkbox"
                    value="${tagCategory.tag}"
                    ${tagCategory.checked ? `checked="${`${tagCategory.checked}`}"` : ''}
                />
                <span class="${TaggingContainerCssClasses.checkmark}" />
            </label>
            <div style="clear:both"></div>`;
    }
    get taggingContainer() {
        return getDomElementOrStub(`#${SlidedownCssIds.body} > div.${TaggingContainerCssClasses.taggingContainer}`);
    }
    toggleCheckedTag(e) {
        const target = e.target;
        if (target && target.getAttribute("type") === "checkbox") {
            const isChecked = target.checked;
            target.setAttribute("checked", isChecked.toString());
        }
    }
    static getValuesFromTaggingContainer() {
        const selector = `#${SlidedownCssIds.body} > div.${TaggingContainerCssClasses.taggingContainer}` +
            `> div > label > input[type=checkbox]`;
        const inputNodeArr = document.querySelectorAll(selector);
        const tags = {};
        inputNodeArr.forEach(node => {
            tags[node.defaultValue] = node.checked;
        });
        return tags;
    }
}
//# sourceMappingURL=TaggingContainer.js.map