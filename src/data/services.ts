import type { ImageMetadata } from 'astro';
import tuneUp from '../assets/photos/tune-up-door.jpg';
import repair from '../assets/photos/tech-spring-repair.jpg';
import estimate from '../assets/photos/estimate-consult.jpg';

export interface Service {
  slug: 'tune-ups' | 'repair' | 'free-estimates';
  title: string;
  short: string;
  body: string;
  included: string[];
  image: ImageMetadata;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
}

// Body copy is Kevin's own wording from the original site.
export const services: Service[] = [
  {
    slug: 'tune-ups',
    title: 'Door Tune-Ups',
    short: 'A complete 40-point safety inspection, lubrication and hardware tightening to keep your door running smoothly.',
    body:
      'The garage door safety tune-up includes a complete 40-point inspection of the garage door, oil/lubrication of essential moving parts and tightening of hardware. We recommend having a tune-up done 1-2 times per year to ensure your door runs efficiently and to reduce risk of potential damage to door.',
    included: [
      'Complete 40-point safety inspection',
      'Oil and lubrication of essential moving parts',
      'Tightening of hardware',
      'Recommended 1–2 times per year',
    ],
    image: tuneUp,
    imageAlt: 'Two-car garage door with windows, seen from inside the garage',
    seoTitle: 'Garage Door Tune-Ups & Maintenance in the Denver Metro',
    seoDescription:
      'Garage door safety tune-ups with a 40-point inspection, lubrication and hardware tightening. Serving Castle Rock to Longmont. Call (720) 295-3221.',
  },
  {
    slug: 'repair',
    title: 'Garage Door Repair',
    short: 'Springs, rollers, openers, tracks and more — fully stocked trucks so most repairs get done the same day.',
    body:
      'Repairs can range from replacement of springs, rollers, motors, bearings, or tracks to alignments of spring system, tracks, or door adjustments. We come equipped with fully stocked trucks to get repairs done same day. It is important to note that some unique doors require specific parts that may need to be ordered so please be as detailed as possible when booking appointments.',
    included: [
      'Spring, roller, motor, bearing and track replacement',
      'Spring system and track alignment',
      'Door adjustments',
      'Same-day repairs from fully stocked trucks',
    ],
    image: repair,
    imageAlt: 'Prestige Garage Doors technician repairing a garage door spring',
    seoTitle: 'Garage Door Repair in the Denver Metro | Same-Day Service',
    seoDescription:
      'Same-day garage door repair: springs, rollers, openers, bearings and tracks. Fully stocked trucks, Castle Rock to Longmont. Call (720) 295-3221.',
  },
  {
    slug: 'free-estimates',
    title: 'Free Estimates',
    short: 'Thinking about a new garage door? We measure on site and give you an in-depth estimate with multiple options.',
    body:
      'We provide free estimates for new garage doors. We will take measurements and pictures on site and give an in depth estimate with multiple options for doors, pricing and time frames.',
    included: [
      'On-site measurements and pictures',
      'In-depth estimate',
      'Multiple door options',
      'Pricing and time frames up front',
    ],
    image: estimate,
    imageAlt: 'Prestige Garage Doors team member reviewing new door options with a homeowner',
    seoTitle: 'Free Estimates on New Garage Doors | Denver Metro',
    seoDescription:
      'Free on-site estimates for new garage doors with multiple options, pricing and time frames. Serving the Denver Metro. Call (720) 295-3221.',
  },
];
