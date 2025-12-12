#!/usr/bin/env node
/**
 * WordPress Services Parser
 * Converts WordPress HTML service content into React-compatible data structure
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface WordPressService {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

interface ReactService {
  slug: string;
  title: string;
  number: string;
  tagline: string;
  overview: {
    paragraphs: string[];
  };
  capabilities: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  process: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  technologies: string[];
  benefits: string[];
  caseStudy?: {
    title: string;
    description: string;
    results: string[];
  };
  pricing: {
    starting: string;
    timeline: string;
    model: string;
  };
  relatedProjects?: string[];
}

function stripHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

function extractDescription(content: string, maxLength: number = 300): string {
  const stripped = stripHTML(content);
  const sentences = stripped.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let description = '';
  for (const sentence of sentences) {
    if (description.length + sentence.length > maxLength) break;
    description += sentence.trim() + '. ';
  }
  
  return description.trim() || stripped.substring(0, maxLength) + '...';
}

function extractCapabilities(content: string): Array<{ icon: string; title: string; description: string }> {
  const capabilities: Array<{ icon: string; title: string; description: string }> = [];
  
  // Look for common patterns in WordPress content
  const listMatches = content.match(/<li[^>]*>(.*?)<\/li>/gi);
  
  if (listMatches && listMatches.length >= 4) {
    for (let i = 0; i < Math.min(4, listMatches.length); i++) {
      const text = stripHTML(listMatches[i]);
      capabilities.push({
        icon: 'fa-check-circle',
        title: text.split(':')[0] || text.substring(0, 30),
        description: text.split(':')[1] || text,
      });
    }
  }
  
  // If no list items found, create generic capabilities
  if (capabilities.length === 0) {
    return [
      { icon: 'fa-chart-line', title: 'Strategic Planning', description: 'Comprehensive analysis and planning for optimal results' },
      { icon: 'fa-cog', title: 'Expert Implementation', description: 'Professional execution with industry best practices' },
      { icon: 'fa-users', title: 'Team Collaboration', description: 'Seamless coordination across all stakeholders' },
      { icon: 'fa-rocket', title: 'Ongoing Support', description: '24/7 monitoring and continuous optimization' },
    ];
  }
  
  return capabilities;
}

function extractBenefits(content: string): string[] {
  const benefits: string[] = [];
  
  // Look for benefit-like content
  const listMatches = content.match(/<li[^>]*>(.*?)<\/li>/gi);
  
  if (listMatches) {
    for (const match of listMatches.slice(0, 5)) {
      const text = stripHTML(match);
      if (text.length > 10 && text.length < 100) {
        benefits.push(text);
      }
    }
  }
  
  // Default benefits if none found
  if (benefits.length === 0) {
    return [
      'Proven track record of success',
      'Expert team with industry experience',
      'Scalable and flexible solutions',
      'Competitive pricing and transparent costs',
      '24/7 support and maintenance',
    ];
  }
  
  return benefits.slice(0, 5);
}

const serviceIcons: Record<string, string> = {
  'web-development': 'fa-code',
  'data-security-compliance': 'fa-shield-alt',
  'artificial-intelligence': 'fa-brain',
  'cloud-computing': 'fa-cloud',
  'ui-ux-design': 'fa-palette',
  'digital-marketing': 'fa-bullhorn',
  'product-strategy': 'fa-lightbulb',
  'social-media': 'fa-share-alt',
  'data-analysis': 'fa-chart-bar',
  'software-solutions': 'fa-laptop-code',
  'it-management': 'fa-network-wired',
  'team-leadership': 'fa-users-cog',
  'contact-center-technology': 'fa-headset',
  'backup-recovery': 'fa-database',
  'document-management': 'fa-file-alt',
  'project-management': 'fa-tasks',
  'digital-transformation': 'fa-sync-alt',
  'management-consulting': 'fa-briefcase',
  'online-training': 'fa-graduation-cap',
  'online-stores': 'fa-shopping-cart',
};

function parseWordPressService(wpService: WordPressService, index: number): ReactService {
  const description = extractDescription(wpService.content);
  const capabilities = extractCapabilities(wpService.content);
  const benefits = extractBenefits(wpService.content);
  
  // Create two paragraphs from description
  const sentences = description.split(/[.!?]+/).filter(s => s.trim());
  const midPoint = Math.floor(sentences.length / 2);
  const paragraph1 = sentences.slice(0, midPoint).join('. ') + '.';
  const paragraph2 = sentences.slice(midPoint).join('. ') + '.';
  
  return {
    slug: wpService.slug,
    title: wpService.title,
    number: String(index + 1).padStart(2, '0'),
    tagline: description.substring(0, 100) + '...',
    overview: {
      paragraphs: [
        paragraph1 || description,
        paragraph2 || 'Our experienced team delivers comprehensive solutions tailored to your business needs.',
      ],
    },
    capabilities,
    process: [
      { step: 1, title: 'Discovery & Analysis', description: 'Understanding your requirements and objectives' },
      { step: 2, title: 'Strategy Development', description: 'Creating a customized approach for success' },
      { step: 3, title: 'Implementation', description: 'Professional execution with best practices' },
      { step: 4, title: 'Optimization', description: 'Continuous improvement and support' },
    ],
    technologies: [],
    benefits,
    pricing: {
      starting: 'Contact for quote',
      timeline: 'Varies by project scope',
      model: 'Project-based or retainer',
    },
  };
}

async function main() {
  console.log('🔄 Parsing WordPress services into React data structure...\n');
  
  try {
    // Read extracted WordPress services
    const servicesPath = join(process.cwd(), 'wordpress-extracted', 'services.json');
    const wpServices: WordPressService[] = JSON.parse(readFileSync(servicesPath, 'utf-8'));
    
    console.log(`📋 Found ${wpServices.length} WordPress services\n`);
    
    // Filter to actual service pages (exclude template pages, privacy policy, etc.)
    const realServices = wpServices.filter(s => 
      !s.slug.includes('template') &&
      !s.slug.includes('privacy') &&
      !s.slug.includes('terms') &&
      !s.slug.includes('style-2') &&
      !s.slug.includes('-op') &&
      s.slug !== 'services' &&
      s.slug !== 'service-details' &&
      s.title !== 'Services' &&
      s.title !== 'Service Details'
    );
    
    console.log(`✅ Filtered to ${realServices.length} actual services:\n`);
    
    // Parse services
    const reactServices: Record<string, ReactService> = {};
    
    realServices.forEach((wpService, index) => {
      console.log(`   ${index + 1}. ${wpService.title} (${wpService.slug})`);
      reactServices[wpService.slug] = parseWordPressService(wpService, index);
    });
    
    // Save to data file
    const outputPath = join(process.cwd(), 'src', 'data', 'wordpress-services.json');
    writeFileSync(outputPath, JSON.stringify(reactServices, null, 2));
    
    console.log(`\n✅ Services data saved to: ${outputPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   Total services: ${Object.keys(reactServices).length}`);
    console.log(`   Each service includes:`);
    console.log(`     - Title and tagline`);
    console.log(`     - 2-paragraph overview`);
    console.log(`     - 4 capabilities`);
    console.log(`     - 4-step process`);
    console.log(`     - 5 benefits`);
    console.log(`     - Pricing information`);
    
    console.log(`\n🎯 Next steps:`);
    console.log(`   1. Review src/data/wordpress-services.json`);
    console.log(`   2. Update ServiceDetail.jsx to import this data`);
    console.log(`   3. Add technologies for each service manually`);
    console.log(`   4. Add case studies if available`);
    
  } catch (error) {
    console.error('❌ Error parsing services:', error);
    process.exit(1);
  }
}

main();
