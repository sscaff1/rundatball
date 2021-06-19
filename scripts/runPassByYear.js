const stats = require('../stats/byYearStats.json');

(() => {
  const composedStats = Object.entries(stats).reduce(
    (obj, [year, s]) => ({
      ...obj,
      [year]: s.reduce(
        (objStat, tStat) => {
          const threshold = year === '2020' ? 14 : 12;
          if (threshold / 2 >= tStat.conferencePlace) {
            return {
              ...objStat,
              playoffTeams: objStat.playoffTeams + 1,
              playoffTeamsPassPlays: objStat.playoffTeamsPassPlays + tStat.pass_att,
              playoffTeamsRunPlays: objStat.playoffTeamsRunPlays + tStat.rush_att,
            };
          }
          return {
            ...objStat,
            nonPlayoffTeams: objStat.nonPlayoffTeams + 1,
            nonPlayoffTeamsPassPlays: objStat.nonPlayoffTeamsPassPlays + tStat.pass_att,
            nonPlayoffTeamsRunPlays: objStat.nonPlayoffTeamsRunPlays + tStat.rush_att,
          };
        },
        {
          nonPlayoffTeams: 0,
          nonPlayoffTeamsPassPlays: 0,
          nonPlayoffTeamsRunPlays: 0,
          playoffTeams: 0,
          playoffTeamsPassPlays: 0,
          playoffTeamsRunPlays: 0,
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
        nonPlayoffPercentRun:
          Math.round(
            (plays.nonPlayoffTeamsRunPlays /
              (plays.nonPlayoffTeamsRunPlays + plays.nonPlayoffTeamsPassPlays)) *
              1000,
          ) / 10,
        playoffPercentRun:
          Math.round(
            (plays.playoffTeamsRunPlays /
              (plays.playoffTeamsRunPlays + plays.playoffTeamsPassPlays)) *
              1000,
          ) / 10,
        year,
      },
    ],
    [],
  );
  console.log(percentages);
})();
