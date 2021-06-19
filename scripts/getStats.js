const fs = require('fs');
const path = require('path');
const p = require('puppeteer');

async function getTeamStats(browser, { year }) {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(`https://www.pro-football-reference.com/years/${year}/index.htm`);
  const data = await page.evaluate(() => {
    const transform = {
      'Oakland Raiders': 'Las Vegas Raiders',
      'San Diego Chargers': 'Los Angeles Chargers',
      'St. Louis Rams': 'Los Angeles Rams',
      'Washington Redskins': 'Washington Football Team',
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
  return Object.values(data).map((d) => d);
}

(async () => {
  const browser = await p.launch({ headless: false });
  const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
  const promises = years.map((y) => getTeamStats(browser, { year: y }));
  const teamsByYear = await Promise.all(promises);
  const json = years.reduce(
    (obj, y, i) => ({
      ...obj,
      [y]: teamsByYear[i],
    }),
    {},
  );
  await browser.close();
  fs.writeFileSync(path.join(__dirname, '../stats/byYearStats.json'), JSON.stringify(json));
})();
