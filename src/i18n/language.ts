import {AppLanguage} from './resources';

export const DEFAULT_LANGUAGE: AppLanguage = 'en';

export function toAppLanguage(input: string | null | undefined): AppLanguage {
    if (!input) {
        return DEFAULT_LANGUAGE;
    }
    return input.toLowerCase().startsWith('no') ? 'no' : 'en';
}

export function formatLanguageLabel(language: AppLanguage): 'EN' | 'NO' {
    return language === 'no' ? 'NO' : 'EN';
}

