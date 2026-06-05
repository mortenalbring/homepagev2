import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {AppLanguage, resources} from './resources';
import {DEFAULT_LANGUAGE, toAppLanguage} from './language';

const STORAGE_KEY = 'appLanguage';

export function getCurrentLanguage(): AppLanguage {
    return toAppLanguage(i18n.language);
}

export function toggleLanguage() {
    const nextLanguage: AppLanguage = getCurrentLanguage() === 'en' ? 'no' : 'en';
    void i18n.changeLanguage(nextLanguage);
}

const initialLanguage = toAppLanguage(
    typeof window !== 'undefined'
        ? window.localStorage.getItem(STORAGE_KEY) || window.navigator.language
        : DEFAULT_LANGUAGE
);

void i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: initialLanguage,
        fallbackLng: DEFAULT_LANGUAGE,
        interpolation: {
            escapeValue: false
        }
    });

i18n.on('languageChanged', (lang: string) => {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, toAppLanguage(lang));
    }
});

export default i18n;
export {Localized, T, useAppLanguage, pickLocalized} from './Localized';
export type {Localizable} from './Localized';
export type {AppLanguage} from './resources';


