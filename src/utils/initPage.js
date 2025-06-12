import Handlebars from 'handlebars';

export const initPage = (containerId, pageComponent, data={}) => {
    if (!pageComponent) {
        return console.error("Не задан компонент");
    }

    document.addEventListener('DOMContentLoaded', () => {
        const root = document.querySelector(containerId);
        const template = Handlebars.compile(pageComponent);
    
        root.innerHTML = template(data);
    });
}