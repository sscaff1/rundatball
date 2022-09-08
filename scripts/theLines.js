Array.from(document.querySelectorAll('#tablepress-1434 tr')).reduce((arr, row) => {
  const cols = Array.from(row.querySelectorAll('td'));
  return [
    ...arr,
    cols.reduce((obj, col, i) => {
      if (i === 0) return { ...obj, team: col.innerHTML };
      if (i === 1) return { ...obj, winTotal: col.innerHTML };
      if (i === 2) return { ...obj, overPrice: col.innerHTML };
      return { ...obj, underPrice: col.innerHTML };
    }, {}),
  ];
}, []);
