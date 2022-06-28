const fs = require('fs');
const path = require('path');
const p = require('puppeteer');

const file = fs.createWriteStream(path.join(__dirname, '../stats/playerPassingStatsByYear.json'));

async function getPlayerPassingStats(browser, { year }) {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(`https://www.pro-football-reference.com/years/${year}/passing.htm`);
  const data = await page.evaluate(() => {
    const stats = [];
    document.querySelectorAll('#passing tbody tr[data-row] td').forEach((el) => {
      const { stat } = el.dataset;
      if (stat === 'player') {
        stats.push({});
      }
      stats[stats.length - 1] = {
        ...stats[stats.length - 1],
        [stat]: el.innerText,
      };
    });
    return stats;
  });
  await page.close();
  file.write(`"${year}": ${JSON.stringify(data)},`);
}

(async () => {
  const browser = await p.launch();
  file.write('{');
  for (let year = 1989; year <= 2021; year += 1) {
    // eslint-disable-next-line no-await-in-loop
    await getPlayerPassingStats(browser, { year });
  }

  await browser.close();
  file.write('}');
  file.end();
})();
