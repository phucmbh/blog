import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('java', java);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
import 'highlight.js/styles/base16/solarized-dark.css'; //Chọn theme hiển thị cho đoạn code, bạn có thể tham khảo theme tại đây https://highlightjs.org/

export const initHightlightJS = () => {
  // hljs.initHighlighting();
  hljs.highlightAll();
};
