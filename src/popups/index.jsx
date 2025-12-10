import { PortfolioContent } from './PortfolioContent';
import { ReadmeContent } from './ReadmeContent';
import { SiteRedesignContent } from './SiteRedesignContent';
import { ApiWorkContent } from './ApiWorkContent';
import { ExperimentsContent } from './ExperimentsContent';
import { OldStuffContent } from './OldStuffContent';
import {BlogComponent} from "./blog/BlogComponent";
import {ContactComponent} from "./contact/ContactComponent";

/**
  Registry mapping popup IDs to their content components.
 */
export const popupRegistry = {
  'portfolio': PortfolioContent,
  'readme': ReadmeContent,
  'contact': ContactComponent,
  'blog': BlogComponent,
  'site-redesign': SiteRedesignContent,
  'api-work': ApiWorkContent,
  'experiments': ExperimentsContent,
  'old-stuff': OldStuffContent,
};

export function NotFoundContent() {
  return (
    <div style={{ padding: 8 }}>
      <p>Content not found</p>
    </div>
  );
}
