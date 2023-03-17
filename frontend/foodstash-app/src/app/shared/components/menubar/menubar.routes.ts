import {APP_ROUTES} from '../../../core/routes.table';

export interface MenubarRoutes {
  link: string;
  class: string;
  title: string;
  extraTitle?: string;
  icon: string;
}

export const rightDefaultRoutes: MenubarRoutes[] = [
  {
    link: APP_ROUTES.login,
    class: '',
    title: 'navbar.login',
    icon: 'login'
  },
  {
    link:  APP_ROUTES.signup,
    class: 'navbar-primary',
    title: 'navbar.signUp',
    icon: 'person_add'
  }
];

export const leftDefaultRoutes: MenubarRoutes[] = [
  {
    link:  APP_ROUTES.about,
    class: '',
    title: 'navbar.about',
    icon: 'info'
  }
];

export const rightLoggedRoutes = (username: string): MenubarRoutes[] => [
  {
    link: '/profile',
    class: '',
    title: username,
    icon: 'account_circle'
  }
];

export const leftLoggedRoutes: MenubarRoutes[] = [
  {
    link: '/stashes',
    class: '',
    title: 'navbar.stash',
    icon: 'warehouse'
  },
  {
    link: '/about',
    class: '',
    title: 'navbar.about',
    icon: 'info'
  }
];

