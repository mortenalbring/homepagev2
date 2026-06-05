import {useTranslation} from 'react-i18next';
import './PopupStyles.css';
import {LocalizedPopupFrame} from './LocalizedPopupFrame';

export function ComputationsIrreversibilityContentNo() {
    const {t} = useTranslation();

    return (
        <LocalizedPopupFrame title={t('computations.norwegianPlaceholderTitle')}>
            <p>{t('computations.norwegianPlaceholderBody')}</p>
        </LocalizedPopupFrame>
    );
}

