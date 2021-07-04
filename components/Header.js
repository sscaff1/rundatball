import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Container } from 'reactstrap';
import { createUseStyles } from 'react-jss';
import locale from 'locale/english';
import { Theme } from 'themes/default';
import cn from 'classnames';
import links from './links';

const useStyles = createUseStyles((theme) => ({
  brand: {
    '@media (max-width: 768px)': {
      height: 1,
      position: 'absolute',
      textIndent: -99999,
      visibility: 'hidden',
      width: 1,
    },
  },
  navbar: {
    '& a': {
      textShadow: theme.shadow.text,
    },
    '&.notHome': {
      background: theme.palette.primary.dark,
      position: 'relative',
    },

    background: 'transparent',
    left: 0,
    margin: [0, 'auto'],
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  navbarContainer: {
    maxWidth: 800,
  },
  post: {
    '& > a': {
      color: `${theme.palette.text.dark} !important`,
      textShadow: 'none',
    },
    '&:hover': {
      transform: 'scale(1.07)',
    },
    background: theme.palette.background,
    borderRadius: 4,
    boxShadow: theme.shadow.text,
    transform: 'scale(1)',
    transition: 'transform 0.5s',
  },
}));

const Header = () => {
  const classes = useStyles();
  const router = useRouter();
  const isHome = router.pathname === '/';
  return (
    <Navbar dark expand="md" className={cn(classes.navbar, { notHome: !isHome })}>
      <Container className={cn(classes.navbarContainer, 'justify-content-center')}>
        <NavbarBrand href="/" className={classes.brand}>
          <h3>{locale.siteName}</h3>
        </NavbarBrand>
        <Nav className="ml-md-auto flex-row my-2 my-md-0" navbar>
          {links.map((l) => (
            <NavItem key={l.to} className={l.label === locale.PostAJob ? classes.post : undefined}>
              <Link href={l.to} passHref>
                <NavLink className="px-3" active={l.to === router.pathname}>
                  {l.alabel}
                </NavLink>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
