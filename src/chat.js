import Handlebars from 'handlebars';
import { initPage } from './utils/initPage';
import { chatPage } from './pages';
import { Button, ChatBadge, Message } from './partials';
import './styles/main.styl';

Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('ChatBadge', ChatBadge);
Handlebars.registerPartial('Message', Message);

const chats = [
    { name: 'Мария', lastMessage: 'Давно не виделись. А у нас петухи с 4 утра', unreadCount: 2 },
    { name: 'Miko Li', lastMessage: 'Привет, вы русский гид?', unreadCount: 1 },
];

const messages = [
    { isInterlocutor: true, text: 'Привет, идёшь сегодня гулять?', time: '10:42' },
    { isInterlocutor: false, text: 'Привет, го на великах!', time: '10:45' },
];

initPage('#chat', chatPage, { chats, messages });
