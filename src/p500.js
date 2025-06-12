import Handlebars from 'handlebars';
import { initPage } from './utils/initPage';
import { p500Page } from './pages';
import { PageError } from './partials';
import './styles/main.styl';

Handlebars.registerPartial('PageError', PageError);

initPage('#p500', p500Page);
