import { SITE } from './site';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
}

export function buildMeta(props: SEOProps) {
  const title = props.title ? `${props.title} — ${SITE.name}` : SITE.title;
  const description = props.description || SITE.description;
  const canonical = props.canonical || SITE.url;
  const ogImage = props.ogImage || `${SITE.url}/og-default.png`;
  const ogType = props.ogType || 'website';

  return { title, description, canonical, ogImage, ogType };
}
