import { createUseStyles } from 'utils/theming';
import Header from './Header';

const useStyles = createUseStyles((theme) => ({
  root: {
    backgroundColor: ({ darkMode }) => (darkMode ? '#000' : '#fff'),
    minHeight: 'calc(100vh - 115px)',
    transition: 'background-color 0.5s ease',
  },
}));

export default function Layout({ children }) {
  const classes = useStyles();
  return (
    <div>
      <Header />
      <div className={classes.root}>{children}</div>
    </div>
  );
}
