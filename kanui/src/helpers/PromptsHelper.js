export default class PromptsHelper {
    static isCategorySlidedownConfigured(context) {
        const { promptOptions } = context.appConfig.userConfig;
        if (!promptOptions || !promptOptions.slidedown || !promptOptions.slidedown.categories) {
            return false;
        }
        return (!!promptOptions.slidedown.categories.tags && promptOptions.slidedown.categories.tags.length > 0);
    }
}
//# sourceMappingURL=PromptsHelper.js.map