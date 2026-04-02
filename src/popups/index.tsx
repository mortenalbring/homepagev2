import {FC, Suspense, lazy} from 'react';
import {useTranslation} from 'react-i18next';
import {AppLanguage} from '../i18n/resources';

import 'typeface-ibm-plex-mono';

// Lazy-load popup components for better code splitting
const PortfolioContent = lazy(() => import('./PortfolioContent').then(m => ({ default: m.PortfolioContent })));
const ReadmeContent = lazy(() => import('./ReadmeContent').then(m => ({ default: m.ReadmeContent })));
const SiteRedesignContent = lazy(() => import('./SiteRedesignContent').then(m => ({ default: m.SiteRedesignContent })));
const ExperimentsContent = lazy(() => import('./ExperimentsContent').then(m => ({ default: m.ExperimentsContent })));
const ComputationsIrreversibilityContent = lazy(() => import('./ComputationsIrreversibilityContent').then(m => ({ default: m.ComputationsIrreversibilityContent })));
const ComputationsIrreversibilityContentNo = lazy(() => import('./ComputationsIrreversibilityContent.no').then(m => ({ default: m.ComputationsIrreversibilityContentNo })));
const BlogComponent = lazy(() => import('./blog/BlogComponent').then(m => ({ default: m.BlogComponent })));
const ContactComponent = lazy(() => import('./contact/ContactComponent').then(m => ({ default: m.ContactComponent })));
const MortsweeperContent = lazy(() => import('./mortsweeper/MortsweeperContent').then(m => ({ default: m.MortsweeperContent })));
const HomeAssistantDashboards = lazy(() => import('./HomeAssistantDashboards').then(m => ({ default: m.HomeAssistantDashboards })));
const WelcomeContent = lazy(() => import('./welcomeContent/WelcomeContent').then(m => ({ default: m.WelcomeContent })));
const YtDlp = lazy(() => import('./jellyfin/ytdlp').then(m => ({ default: m.YtDlp })));
const YtDlpConfig = lazy(() => import('./jellyfin/ytdlp-config').then(m => ({ default: m.YtDlpConfig })));

/** Props shared by all popup content components. */
export interface PopupContentComponentProps {
    onClose?: () => void;
}

/** A popup content component accepting standard popup props. */
export type PopupComponent = FC<PopupContentComponentProps>;

export type PopupComponentsByLanguage = {
    en: PopupComponent;
    no?: PopupComponent;
};

/**
 * Registry mapping popup IDs to localized content components.
 * Add a `no` component only when translation exists; otherwise English fallback is used.
 */
export const popupRegistry: Record<string, PopupComponentsByLanguage> = {
    'welcome': {en: WelcomeContent},
    'portfolio': {en: PortfolioContent},
    'readme': {en: ReadmeContent},
    'contact': {en: ContactComponent},
    'blog': {en: BlogComponent},
    'site-redesign': {en: SiteRedesignContent},
    'ha-dashboards': {en: HomeAssistantDashboards},
    'experiments': {en: ExperimentsContent},
    'computations': {en: ComputationsIrreversibilityContent, no: ComputationsIrreversibilityContentNo},
    'ytdlp': {en: YtDlp},
    'ytdlp-config': {en: YtDlpConfig},
    'mortsweeper': {en: MortsweeperContent},
};

export function getPopupComponent(popupId: string, language: AppLanguage): PopupComponent | null {
    const localized = popupRegistry[popupId];
    if (!localized) {
        return null;
    }
    return localized[language] ?? localized.en;
}

export const NotFoundContent: FC = () => {
    const {t} = useTranslation();

    return (
        <div style={{padding: 8}}>
            <p>{t('popup.notFound')}</p>
        </div>
    );
};
