import {FC, Suspense} from 'react';
import {useTranslation} from 'react-i18next';
import {getPopupComponent, NotFoundContent} from '../popups';
import {toAppLanguage} from '../i18n/language';

interface PopupContentProps {
    popupId: string;
    onClose?: () => void;
}

const LoadingFallback: FC = () => (
    <div style={{padding: 8}}>
        <p>Loading...</p>
    </div>
);

/**
 * Renders popup content for the active language.
 */
const PopupContent: FC<PopupContentProps> = ({popupId, onClose}) => {
    const {i18n} = useTranslation();
    const language = toAppLanguage(i18n.language);
    const Component = getPopupComponent(popupId, language);

    if (!Component) {
        return <NotFoundContent/>;
    }

    return (
        <Suspense fallback={<LoadingFallback/>}>
            <Component onClose={onClose}/>
        </Suspense>
    );
};

export default PopupContent;
