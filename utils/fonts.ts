import { Open_Sans, Fira_Sans } from 'next/font/google';
import localFont from 'next/font/local';

export const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans'
});

export const firaSansFont = Fira_Sans({
  subsets: ['latin-ext'],
  weight: '600',
  variable: '--font-logo'
});
