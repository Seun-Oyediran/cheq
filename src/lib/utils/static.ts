export const footerData = [
  {
    id: 1,
    title: 'Resources',
    items: [
      { id: 1, label: 'FAQ', path: '#' },
      { id: 2, label: 'Privacy', path: '#' },
      { id: 3, label: 'Newsletter', path: '#' },
    ],
  },

  {
    id: 2,
    title: 'Developers',
    items: [
      { id: 1, label: 'Documentation', path: '#' },
      { id: 2, label: 'Support', path: '#' },
    ],
  },

  {
    id: 3,
    title: 'Need Help?',
    items: [
      { id: 1, label: 'Contact Us', path: '#' },
      { id: 2, label: 'Help center', path: '#' },
    ],
  },
];

export const aviVariants = {
  aquafresh: {
    fill: '#5CFE9D',
    bg: '#C5FFDC',
  },
  tangerine: {
    fill: '#E4813F',
    bg: '#FFDB99',
  },
  mantis: {
    fill: '#4AB271',
    bg: '#C5FFDC',
  },
  white: {
    fill: '#ffffff',
    bg: '#A0A0A0',
  },

  sapphire: {
    fill: '#425EB9',
    bg: '#B0CCFF',
  },

  lightgray: {
    fill: '#efefef',
    bg: '#d7d7d7',
  },

  platinum: {
    fill: '#e4e4e4',
    bg: '#f5f5f5',
  },

  black: {
    fill: '#878787',
    bg: '#000',
  },
};

export type IAviVariants = keyof typeof aviVariants;

export const aviVariantsArray: IAviVariants[] = [
  'aquafresh',
  'black',
  'lightgray',
  'mantis',
  'platinum',
  'sapphire',
  'tangerine',
  'white',
];

export const authModalVariants = {
  login: {
    height: '533px',
  },
  createAccount: {
    height: '370px',
  },
  selectAvatar: {
    height: '510px',
  },

  welcome: {
    height: '424px',
  },
};

export type IAuthModalVariants = keyof typeof authModalVariants;

export const spring = {
  type: 'spring',
  damping: 20,
  stiffness: 150,
};
