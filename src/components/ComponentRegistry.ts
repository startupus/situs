import { 
  Portfolio1, Portfolio2, Portfolio3,
  Testimonials1, Testimonials2, Testimonials3
} from '../redactus-components/content';

export interface ComponentDefinition {
  id: string;
  name: string;
  category: string;
  component: React.ComponentType<any>;
  thumbnail?: string;
  description?: string;
}

export const portfolioComponents: ComponentDefinition[] = [
  {
    id: 'portfolio1',
    name: 'Portfolio Grid',
    category: 'content',
    component: Portfolio1,
    description: 'Simple portfolio grid with 6 projects'
  },
  {
    id: 'portfolio2',
    name: 'Portfolio Masonry',
    category: 'content',
    component: Portfolio2,
    description: 'Masonry-style portfolio with different card sizes'
  },
  {
    id: 'portfolio3',
    name: 'Portfolio Filterable',
    category: 'content',
    component: Portfolio3,
    description: 'Portfolio with category filtering and animations'
  }
];

export const testimonialsComponents: ComponentDefinition[] = [
  {
    id: 'testimonials1',
    name: 'Testimonials Grid',
    category: 'content',
    component: Testimonials1,
    description: 'Simple testimonials grid with ratings'
  },
  {
    id: 'testimonials2',
    name: 'Testimonials Slider',
    category: 'content',
    component: Testimonials2,
    description: 'Large testimonial cards with navigation'
  },
  {
    id: 'testimonials3',
    name: 'Testimonials Compact',
    category: 'content',
    component: Testimonials3,
    description: 'Compact testimonials with stats section'
  }
];

export const allContentComponents = [
  ...portfolioComponents,
  ...testimonialsComponents
];

export default allContentComponents; 