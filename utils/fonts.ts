import { Open_Sans, Fira_Sans } from 'next/font/google';

export const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans'
});

export const firaSans = Fira_Sans({
  subsets: ['latin-ext'],
  weight: '400',
  variable: '--font-logo'
});

export const firaSansLogo = Fira_Sans({
  subsets: ['latin-ext'],
  weight: '600',
  variable: '--font-logo'
});
