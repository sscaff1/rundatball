const fs = require('fs');
const path = require('path');
const p = require('puppeteer-extra');
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer');

// Add adblocker plugin, which will transparently block ads in all pages you
// create using puppeteer.
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

p.use(
  AdblockerPlugin({
    // Optionally enable Cooperative Mode for several request interceptors
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
  }),
);

const file = fs.createWriteStream(path.join(__dirname, '../stats/playerStatsByYear.json'));

const pageStats = [
  'passing',
  'rushing',
  'receiving',
  'scrimmage',
  'defense',
  'kicking',
  'returns',
  'scoring',
];

async function getPlayerStats(browser, { pageStat, year }) {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(`https://www.pro-football-reference.com/years/${year}/${pageStat}.htm`);
  const data = await page.evaluate(() => {
    const stats = [];
    document.querySelectorAll('table tbody tr[data-row]:not(.thead) td').forEach((el) => {
      const { stat } = el.dataset;
      if (stat === 'player') {
        stats.push({});
      }
      if (stat === 'team') {
        stats[stats.length - 1] = {
          ...stats[stats.length - 1],
          [stat]: el.querySelector('a')?.title || el.innerText,
        };
      } else {
        stats[stats.length - 1] = {
          ...stats[stats.length - 1],
          [stat]: el.innerText,
        };
      }
    });
    return stats;
  });
  await page.close();
  file.write(`"${year}": ${JSON.stringify(data)},`);
}

(async () => {
  const browser = await p.launch({ headless: false });
  file.write('{');
  for (let year = 1957; year <= 2021; year += 1) {
    for (let i = 0; i < pageStats.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await getPlayerStats(browser, { pageStat: pageStats[i], year });
    }
  }

  await browser.close();
  file.write('}');
  file.end();
})();
