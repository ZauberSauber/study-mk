import Handlebars from "handlebars";

export default function handlebars() {
    const fileRegex = /\.hbs$/;

    return {
        name: 'vite-plugin-handlebars-precompile',
        transform(src, id) {
            if (!fileRegex.test(id)) {
                return;
            }

            const code = `
                import Handlebars from "handlebars/runtime";

                export default Handlebars.template(${Handlebars.precompile(src)});
            `;
            
            return { code };
        }
    }
}