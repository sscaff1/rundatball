import { useDarkMode } from 'context/DarkContext';
import { createUseStyles as baseCreateUseStyles } from 'react-jss';

const createUseStyles = (...jssProps) => {
  const useBaseStyles = baseCreateUseStyles(...jssProps);
  const useStyles = (props) => {
    const { darkMode } = useDarkMode();
    return useBaseStyles({ ...props, darkMode });
  };

  return useStyles;
};

// eslint-disable-next-line import/prefer-default-export
export { createUseStyles };
