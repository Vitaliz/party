import context from '../utils/context';
import { APP_SUPPORT } from '../utils/constants';

if ('console' in context) {
  try {
    if ('clear' in context.console) {
      context.console.clear();
    }
  } catch { /* ignore */ }

  const FONT_FAMILY = 'font-family:Montserrat,"Avenir Black",Verdana,"Century Gothic","Arial Black",monospace,monospace';

  const WARN_TEMPLATE = '%c%s';
  const WARN_STYLE = `font-size:20px;font-weight:600;${FONT_FAMILY}`;
  const WARN_MESSAGE = `Эта функция браузера предназначена для разработчиков. Если кто-то сказал вам скопировать и вставить что-то здесь, чтобы включить функцию приложения или «взломать» чей-то аккаунт, это мошенники. Выполнив эти действия, вы предоставите им доступ к своему аккаунту.`;

  const LOGO_TEMPLATE = `%cPARTY %cGAMES`;
  const LOGO_STYLE = `color:#00A3FF;font-size:50px;font-weight:800;${FONT_FAMILY}`;

  const SUPPORT_TEMPLATE = `%c%s %o`;
  const SUPPORT_STYLE = `color:#43A047;font-weight:600;${FONT_FAMILY}`;
  const SUPPORT_MESSAGE = 'Тех. поддержка:';

  try {
    const logger = (...params) => window.setTimeout(() => context.console.log(...params), 0);
    logger(LOGO_TEMPLATE, LOGO_STYLE, LOGO_STYLE);
    logger(WARN_TEMPLATE, WARN_STYLE, WARN_MESSAGE);
    logger(SUPPORT_TEMPLATE, SUPPORT_STYLE, SUPPORT_MESSAGE, APP_SUPPORT);
  } catch { /* ignore */ }
}
