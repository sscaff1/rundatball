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

const file = fs.createWriteStream(path.join(__dirname, '../stats/byYearStats.json'));

async function getTeamStats(browser, { year }) {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(`https://www.pro-football-reference.com/years/${year}/index.htm`);
  const data = await page.evaluate(() => {
    const transform = {
      'Oakland Raiders': 'Las Vegas Raiders',
      'San Diego Chargers': 'Los Angeles Chargers',
      'St. Louis Rams': 'Los Angeles Rams',
      'Washington Football Team': 'Washington Commanders',
      'Washington Redskins': 'Washington Commanders',
    };
    const trs = [
      ...document.querySelectorAll(`#afc_playoff_standings tbody tr[data-row] [data-stat]`),
      ...document.querySelectorAll(`#nfc_playoff_standings tbody tr[data-row] [data-stat]`),
    ];

    const teams = {};
    let currentTeam;
    let conferencePlace = 1;
    trs.forEach((el) => {
      if (el.dataset.stat === 'team') {
        const teamRegex = /([\w .]+)\(?([0-9])?\)?/;
        const [, team, playoffPlaceString] = el.innerText.match(teamRegex);
        const playoffFinish = parseInt(playoffPlaceString, 10);
        const teamName = team.trim();
        if (playoffFinish === 1) {
          conferencePlace = 1;
        }
        currentTeam = transform[teamName] || teamName;
        teams[currentTeam] = {
          conferencePlace,
          currentTeamName: currentTeam,
          playoffFinish,
          teamName,
        };
        conferencePlace += 1;
      } else {
        const isNotNumber = ['why', 'reason'].includes(el.dataset.stat);
        teams[currentTeam] = {
          ...teams[currentTeam],
          [el.dataset.stat]: !isNotNumber ? parseFloat(el.innerText) : el.innerText,
        };
      }
    });
    const teamStatRows = document.querySelectorAll('#team_stats tbody tr[data-row] td');
    teamStatRows.forEach((el) => {
      if (el.dataset.stat === 'team') {
        const teamName = el.innerText.trim();
        currentTeam = transform[teamName] || teamName;
        if (!teams[currentTeam]) {
          teams[currentTeam] = {
            ...teams[currentTeam],
            currentTeamName: currentTeam,
            teamName,
          };
        }
      } else {
        teams[currentTeam] = {
          ...teams[currentTeam],
          [el.dataset.stat]: parseFloat(el.innerText),
        };
      }
    });
    return teams;
  });

  await page.close();
  file.write(`"${year}": ${JSON.stringify(Object.values(data).map((d) => d))}, `);
}

(async () => {
  const browser = await p.launch({ headless: false });
  file.write('{');
  for (let year = 1990; year <= 2022; year += 1) {
    // eslint-disable-next-line no-await-in-loop
    await getTeamStats(browser, { year });
  }
  await browser.close();
  file.write('}');
  file.end();
})();
