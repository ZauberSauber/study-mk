import Handlebars from 'handlebars';
import { initPage } from './utils/initPage';
import { loginPage } from './pages';
import { Button, Input } from './partials';
import { registerBlockHelper } from './utils/registerBlockHelper';
import './styles/main.styl';

registerBlockHelper();
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);

initPage('#login', loginPage);
