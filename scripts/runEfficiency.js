const stats = require('../stats/byYearStats.json');

(() => {
  const composedStats = Object.entries(stats).reduce(
    (obj, [year, s]) => ({
      ...obj,
      [year]: s.reduce(
        (objStat, tStat) => {
          const threshold = year === '2020' ? 14 : 12;
          const isPlayoffTeam = tStat.conferencePlace <= threshold / 2;
          const teamKey = isPlayoffTeam ? 'playoffTeams' : 'nonPlayoffTeams';
          const key = isPlayoffTeam ? 'runEfficiencyPlayoff' : 'runEfficiencyNonPlayoff';
          return {
            ...objStat,
            [key]:
              objStat[key] +
              tStat.rush_yds_per_att +
              (tStat.rush_td / tStat.rush_att) * 100 -
              (tStat.fumbles_lost / tStat.rush_att) * 100,
            [teamKey]: objStat[teamKey] + 1,
          };
        },
        {
          nonPlayoffTeams: 0,
          playoffTeams: 0,
          runEfficiencyNonPlayoff: 0,
          runEfficiencyPlayoff: 0,
        },
      ),
    }),
    {},
  );
  console.log(composedStats);
  const percentages = Object.entries(composedStats).reduce(
    (arr, [year, plays]) => [
      ...arr,
      {
        runEfficiencyNonPlayoff:
          Math.round((plays.runEfficiencyNonPlayoff / plays.nonPlayoffTeams) * 100) / 100,
        runEfficiencyPlayoff:
          Math.round((plays.runEfficiencyPlayoff / plays.playoffTeams) * 100) / 100,
        year,
      },
    ],
    [],
  );
  console.log(percentages);
})();
