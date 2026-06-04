import { query } from '@/lib/db';
import LandingPageClient from './LandingPageClient';

// Force dynamic rendering so that we get latest content from DB on refresh
export const revalidate = 0;

export default async function Page() {
  let packages: any[] = [];
  let testimonials: any[] = [];
  let posts: any[] = [];
  let coverage: any[] = [];
  let links: any[] = [];
  let sosmed: any[] = [];

  try {
    packages = await query('SELECT * FROM packages WHERE is_active = 1') as any[];
    testimonials = await query('SELECT * FROM testimonials WHERE is_active = 1') as any[];
    posts = await query('SELECT * FROM posts WHERE is_published = 1 ORDER BY published_at DESC LIMIT 3') as any[];
    coverage = await query('SELECT * FROM konfigs WHERE jns = "coverage_area"') as any[];
    links = await query('SELECT * FROM konfigs WHERE jns = "link"') as any[];
    sosmed = await query('SELECT * FROM konfigs WHERE jns = "media_sosial"') as any[];

  } catch (error) {
    console.error('Error fetching landing page data:', error);
  }

  // Safely parse packages features JSON
  const parsedPackages = packages.map(pkg => {
    let featuresList = [];
    if (pkg.features) {
      try {
        featuresList = typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features;
        if (!Array.isArray(featuresList)) {
          featuresList = [];
        }
      } catch (e) {
        featuresList = [];
      }
    }
    return {
      ...pkg,
      price: typeof pkg.price === 'string' ? parseFloat(pkg.price) : pkg.price,
      features: featuresList
    };
  });

  return (
    <LandingPageClient
      initialPackages={parsedPackages}
      initialTestimonials={testimonials}
      initialPosts={posts}
      initialCoverage={coverage}
      initialLinks={links}
      initialSosmed={sosmed}
    />
  );
}
