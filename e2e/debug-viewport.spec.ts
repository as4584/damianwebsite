import { test } from '@playwright/test';

test('debug viewport issue', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('load');
  
  const chatButton = page.getByRole('button', { name: 'Open chat' });
  
  // Get viewport size
  const viewport = page.viewportSize();
  console.log('Viewport:', viewport);
  
  // Get bounding box
  const box = await chatButton.boundingBox();
  console.log('Button bounding box:', box);
  
  // Get computed styles
  const styles = await chatButton.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      position: computed.position,
      bottom: computed.bottom,
      right: computed.right,
      zIndex: computed.zIndex,
      transform: computed.transform,
      display: computed.display,
      visibility: computed.visibility,
      pointerEvents: computed.pointerEvents,
    };
  });
  console.log('Button styles:', styles);
  
  // Get parent container info
  const parentInfo = await chatButton.evaluate((el) => {
    let parent = el.parentElement;
    const parents = [];
    while (parent && parent !== document.body) {
      const computed = window.getComputedStyle(parent);
      parents.push({
        tag: parent.tagName,
        overflow: computed.overflow,
        transform: computed.transform,
        position: computed.position,
      });
      parent = parent.parentElement;
    }
    return parents;
  });
  console.log('Parents:', JSON.stringify(parentInfo, null, 2));
  
  // Get document and body dimensions
  const dimensions = await page.evaluate(() => {
    const htmlStyles = window.getComputedStyle(document.documentElement);
    const bodyStyles = window.getComputedStyle(document.body);
    return {
      documentHeight: document.documentElement.scrollHeight,
      documentClientHeight: document.documentElement.clientHeight,
      bodyHeight: document.body.scrollHeight,
      bodyClientHeight: document.body.clientHeight,
      windowInnerHeight: window.innerHeight,
      bodyOffsetHeight: document.body.offsetHeight,
      htmlPosition: htmlStyles.position,
      htmlTransform: htmlStyles.transform,
      htmlOverflow: htmlStyles.overflow,
      bodyPosition: bodyStyles.position,
      bodyTransform: bodyStyles.transform,
      bodyOverflow: bodyStyles.overflow,
    };
  });
  console.log('Document dimensions:', dimensions);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-viewport.png', fullPage: true });
});
