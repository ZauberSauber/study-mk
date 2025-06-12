import Handlebars from 'handlebars';

export const registerBlockHelper = () => Handlebars.registerHelper("block", function (options) {
    return new Handlebars.SafeString('<div class="block">' + options.fn(this) + "</div>");
});