import Handlebars from 'handlebars';
import { initPage } from './utils/initPage';
import { p404Page } from './pages';
import { PageError } from './partials';
import './styles/main.styl';

Handlebars.registerPartial('PageError', PageError);

initPage('#p404', p404Page);
