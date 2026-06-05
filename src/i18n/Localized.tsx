import {FC, ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {AppLanguage} from './resources';
import {DEFAULT_LANGUAGE, toAppLanguage} from './language';

/**
 * Returns the active app language (`'en' | 'no'`). Re-renders the calling
 * component whenever the language changes.
 */
export function useAppLanguage(): AppLanguage {
    const {i18n} = useTranslation();
    return toAppLanguage(i18n.language);
}

/**
 * A value that can be authored either as a plain string (same in every
 * language) or as a partial language map. Missing languages fall back to
 * English, then to whatever value is provided.
 */
export type Localizable<T = string> = T | Partial<Record<AppLanguage, T>>;

/**
 * Resolve a `Localizable<T>` to a concrete value for the given language.
 * Falls back to English, then to the first defined entry.
 */
export function pickLocalized<T>(value: Localizable<T> | undefined, language: AppLanguage): T | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'object') return value as T;
    const map = value as Partial<Record<AppLanguage, T>>;
    if (map[language] !== undefined) return map[language];
    if (map[DEFAULT_LANGUAGE] !== undefined) return map[DEFAULT_LANGUAGE];
    const first = Object.values(map).find(v => v !== undefined);
    return first as T | undefined;
}

type LocalizedChildren = Partial<Record<AppLanguage, ReactNode>>;

interface LocalizedProps {
    children: LocalizedChildren;
    /**
     * Optional explicit fallback when the active language is missing. Defaults
     * to the English entry, then to the first defined entry.
     */
    fallback?: ReactNode;
}

/**
 * Renders the slot matching the active language.
 *
 * Usage:
 *   <Localized>{{
 *     en: <p>Hello</p>,
 *     no: <p>Hei</p>,
 *   }}</Localized>
 *
 * If a language is missing, falls back to English, then to the first defined
 * slot, then to `fallback`. Author content in JSX directly — no translation
 * keys required.
 */
export const Localized: FC<LocalizedProps> = ({children, fallback = null}) => {
    const language = useAppLanguage();
    if (children[language] !== undefined) return <>{children[language]}</>;
    if (children[DEFAULT_LANGUAGE] !== undefined) return <>{children[DEFAULT_LANGUAGE]}</>;
    const firstDefined = Object.values(children).find(v => v !== undefined);
    return <>{firstDefined ?? fallback}</>;
};

interface TProps extends Partial<Record<AppLanguage, ReactNode>> {
    /** Optional fallback if no matching language slot is defined. */
    fallback?: ReactNode;
}

/**
 * Tiny inline localized text helper. Use for short labels and titles where
 * a full `<Localized>` block would be overkill.
 *
 * Usage:
 *   <T en="Open" no="Åpne" />
 *   <button><T en="Save" no="Lagre" /></button>
 */
export const T: FC<TProps> = ({en, no, fallback = null}) => {
    const language = useAppLanguage();
    const slots: Partial<Record<AppLanguage, ReactNode>> = {en, no};
    if (slots[language] !== undefined && slots[language] !== null) return <>{slots[language]}</>;
    if (slots[DEFAULT_LANGUAGE] !== undefined && slots[DEFAULT_LANGUAGE] !== null) return <>{slots[DEFAULT_LANGUAGE]}</>;
    const firstDefined = Object.values(slots).find(v => v !== undefined && v !== null);
    return <>{firstDefined ?? fallback}</>;
};

