import { processAozoraHtml } from '../utils/aozoraParser.js';

self.onmessage = (e) => {
  const { buffer } = e.data;
  try {
    const html = processAozoraHtml(buffer);
    self.postMessage({ html });
  } catch (err) {
    self.postMessage({ error: String(err) });
  }
};
