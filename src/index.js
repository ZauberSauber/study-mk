import Handlebars from 'handlebars';
import { Button } from './partials';
import { homePage } from './pages';
import { initPage } from './utils/initPage';
import './styles/main.styl';

Handlebars.registerPartial('Button', Button);

initPage('#app', homePage);
