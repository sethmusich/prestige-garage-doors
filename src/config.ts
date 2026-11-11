// Every business fact the site shows lives here. Change it here, not in pages.

export const SITE = {
  name: 'Prestige Garage Doors',
  owner: 'Kevin Reynoso',
  phoneDisplay: '(720) 295-3221',
  phoneHref: 'tel:+17202953221',
  phoneSchema: '+1-720-295-3221',
  bookingUrl:
    'https://book.housecallpro.com/book/Prestige-Garage-Doors/6a27e72806254cf3ae84c4cd25c6b0b9?v2=true',
  googleUrl: 'https://share.google/bAm84qO8wrcA6NIo4',
  rating: 4.9,
  reviewCount: 53,
  instagram: 'https://www.instagram.com/prestigegaragedoorsco/',
  facebook: null as string | null, // TODO: Facebook page URL
  tiktok: null as string | null, // TODO: TikTok URL
  area: 'Castle Rock to Longmont',
  region: 'Denver Metro',
  // Contact form (Web3Forms). Kevin creates a free access key at web3forms.com with his email.
  formEndpoint: 'https://api.web3forms.com/submit',
  formAccessKey: 'TODO-WEB3FORMS-ACCESS-KEY', // TODO: replace with Kevin's Web3Forms access key
} as const;

export const NAV = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services/',
    children: [
      { label: 'Door Tune-Ups', href: '/services/tune-ups/' },
      { label: 'Garage Door Repair', href: '/services/repair/' },
      { label: 'Free Estimates', href: '/services/free-estimates/' },
    ],
  },
  { label: 'About', href: '/about/' },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contact', href: '/contact/' },
] as const;
