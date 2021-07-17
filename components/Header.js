import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Container } from 'reactstrap';
import { createUseStyles } from 'utils/theming';
import cn from 'classnames';
import { useDarkMode } from 'context/DarkContext';

const links = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'About Me',
    to: '/about-me',
  },
  {
    label: 'Contact Me',
    to: '/contact-me',
  },
];

const useStyles = createUseStyles((theme) => ({
  // brand: {
  //   '& h3': {
  //     marginBottom: 0,
  //   },
  //   '@media (max-width: 768px)': {
  //     height: 1,
  //     position: 'absolute',
  //     textIndent: -99999,
  //     visibility: 'hidden',
  //     width: 1,
  //   },
  // },
  // navbar: {
  //   '& a': {
  //     textShadow: theme.shadow.text,
  //   },
  //   '&.notHome': {
  //     background: theme.palette.primary.dark,
  //     position: 'relative',
  //   },
  //   background: theme.palette.primary.dark,
  // },
  // navbarContainer: {
  //   maxWidth: 800,
  // },
}));

const Header = () => {
  const classes = useStyles();
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const isHome = router.pathname === '/';
  return (
    <Navbar expand="xs" color={darkMode ? 'dark' : 'light'}>
      <NavbarBrand href="/">Run That Ball</NavbarBrand>
      <Nav navbar>
        {links.map((l) => (
          <NavItem key={l.to}>
            <Link href={l.to} passHref>
              <NavLink active={l.to === router.pathname}>{l.label}</NavLink>
            </Link>
          </NavItem>
        ))}
        <button type="button" onClick={toggleDarkMode}>
          Toggle Dark Mode
        </button>
      </Nav>
    </Navbar>
  );
};

export default Header;
