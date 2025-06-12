import Handlebars from 'handlebars';
import { initPage } from './utils/initPage';
import { settingsPage } from './pages';
import { Input, Button, Avatar } from './partials';
import { registerBlockHelper } from './utils/registerBlockHelper';
import './styles/main.styl';

registerBlockHelper();
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Avatar', Avatar);

initPage('#settings', settingsPage);