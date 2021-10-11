import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarToggler, Collapse } from 'reactstrap';
import { createUseStyles } from 'utils/theming';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter } from '@fortawesome/fontawesome-free-brands';
import { useDarkMode } from 'context/DarkContext';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

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
  h3: {
    marginBottom: 0,
  },
  toggle: {
    border: 0,
    margin: 0,
    outline: 'none',
    padding: 0,
  },
}));

const Header = () => {
  const [isOpen, setIsOpen] = useState();
  const classes = useStyles();
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const isHome = router.pathname === '/';
  const navbarContent = useMemo(
    () => (
      <Nav navbar>
        {links.map((l) => (
          <NavItem key={l.to}>
            <Link href={l.to} passHref>
              <NavLink active={l.to === router.pathname}>{l.label}</NavLink>
            </Link>
          </NavItem>
        ))}
      </Nav>
    ),
    [router.pathname],
  );

  const socialContent = useMemo(
    () => (
      <Nav navbar className="d-flex align-items-center flex-row">
        <a href="#" target="_blank" rel="noopener noreferrer nofollow" className="mx-2">
          <FontAwesomeIcon icon={faFacebook} size="lg" />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer nofollow" className="mx-2">
          <FontAwesomeIcon icon={faTwitter} size="lg" />
        </a>
        <div className={cn(classes.toggle, 'mx-2')}>
          <DarkModeSwitch checked={darkMode} size={26} onChange={toggleDarkMode} />
        </div>
        <NavbarToggler onClick={() => setIsOpen((t) => !t)} />
      </Nav>
    ),
    [classes.toggle, darkMode, toggleDarkMode],
  );
  return (
    <>
      <Navbar
        expand="md"
        light={!darkMode}
        dark={darkMode}
        className="d-flex justify-content-between align-items-center px-2 d-md-none"
      >
        <NavbarBrand href="/">
          <h3 className={classes.h3}>Run That Ball</h3>
        </NavbarBrand>
        {socialContent}
        <Collapse isOpen={isOpen} navbar>
          {navbarContent}
        </Collapse>
      </Navbar>
      <Navbar
        expand="md"
        light
        className="justify-content-between align-items-center px-5 d-none d-md-flex"
      >
        <NavbarBrand href="/">Run That Ball</NavbarBrand>
        {navbarContent}
        {socialContent}
      </Navbar>
      <div className="custom-shape-divider-bottom-1627947477">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="shape-fill" />
        </svg>
      </div>
    </>
  );
};

export default Header;
