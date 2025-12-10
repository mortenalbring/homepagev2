import { PortfolioContent } from './PortfolioContent';
import { ReadmeContent } from './ReadmeContent';
import { SiteRedesignContent } from './SiteRedesignContent';
import { ApiWorkContent } from './ApiWorkContent';
import { ExperimentsContent } from './ExperimentsContent';
import { OldStuffContent } from './OldStuffContent';
import { ContactComponent } from '../ContactComponent';
import { BlogComponent } from '../BlogComponent';

/**
 * Registry mapping popup IDs to their content components.
 * To add a new popup:
 * 1. Create a new component in src/popups/
 * 2. Add it to this registry with the ID matching fileSystem.json
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
