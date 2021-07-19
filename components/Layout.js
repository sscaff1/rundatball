import { createUseStyles } from 'utils/theming';
import Header from './Header';

const useStyles = createUseStyles((theme) => ({
  root: {
    '& *, *::before, *::after': {
      backgroundColor: ({ darkMode }) =>
        darkMode ? theme.dark.palette.background : theme.palette.background,
      color: ({ darkMode }) => (darkMode ? theme.dark.palette.text : theme.palette.text),
      transition: 'background-color, color 0.5s ease',
    },
  },
}));

export default function Layout({ children }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header />
      <div>{children}</div>
    </div>
  );
}
