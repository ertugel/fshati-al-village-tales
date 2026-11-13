import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

describe('browser analytics initialization', () => {
  it('configures the supplied public measurement ID exactly once and queues events', () => {
    const html = readFileSync('index.html', 'utf8');
    const inlineScripts = Array.from(html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))
      .map((match) => match[1]).filter((script) => script.trim());
    const browser = { dataLayer: [] as IArguments[] };
    const context = { window: browser };
    inlineScripts.forEach((script) => runInNewContext(script, context));
    const commands = browser.dataLayer.map((command) => Array.from(command));
    expect(commands.filter((command) => command[0] === 'config'))
      .toEqual([['config', 'G-41QBXHH3NG']]);
    runInNewContext("gtag('event', 'language_toggle_click', { language: 'en' })", context);
    expect(Array.from(browser.dataLayer[browser.dataLayer.length - 1]))
      .toEqual(['event', 'language_toggle_click', { language: 'en' }]);
    expect(commands.some((command) => command[0] === 'event' && command[1] === 'page_view'))
      .toBe(false);
  });
});