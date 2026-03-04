import {PortfolioContent} from './PortfolioContent';
import {ReadmeContent} from './ReadmeContent';
import {SiteRedesignContent} from './SiteRedesignContent';
import {ExperimentsContent} from './ExperimentsContent';
import {ComputationsIrreversibilityContent} from './ComputationsIrreversibilityContent';
import {BlogComponent} from "./blog/BlogComponent";
import {ContactComponent} from "./contact/ContactComponent";
import {MortsweeperContent} from "./mortsweeper/MortsweeperContent";
import {HomeAssistantDashboards} from "./HomeAssistantDashboards";
import {WelcomeContent} from "./WelcomeContent";

import 'typeface-ibm-plex-mono';
import {YtDlp} from "./jellyfin/ytdlp";

/**
 Registry mapping popup IDs to their content components.
 */
export const popupRegistry = {
    'welcome': WelcomeContent,
    'portfolio': PortfolioContent,
    'readme': ReadmeContent,
    'contact': ContactComponent,
    'blog': BlogComponent,
    'site-redesign': SiteRedesignContent,
    'ha-dashboards': HomeAssistantDashboards,
    'experiments': ExperimentsContent,
    'computations': ComputationsIrreversibilityContent,
    'ytdlp': YtDlp,
    'mortsweeper': MortsweeperContent,
};

export function NotFoundContent() {
    return (
        <div style={{padding: 8}}>
            <p>Content not found</p>
        </div>
    );
}
