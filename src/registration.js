import Handlebars from 'handlebars';
import { initPage } from './utils/initPage';
import { registrationPage } from './pages';
import { Button, Input } from './partials';
import { registerBlockHelper } from './utils/registerBlockHelper';
import './styles/main.styl';

registerBlockHelper();
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Button', Button);

initPage('#registration', registrationPage);
