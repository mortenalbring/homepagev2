export const resources = {
    en: {
        translation: {
            language: {
                current: 'English',
                toggleLabel: 'Switch language'
            },
            popup: {
                notFound: 'Content not found'
            },
            computations: {
                norwegianPlaceholderTitle: 'Norwegian version is coming soon',
                norwegianPlaceholderBody: 'Translate this component in `src/popups/ComputationsIrreversibilityContent.no.tsx`.'
            }
        }
    },
    no: {
        translation: {
            language: {
                current: 'Norsk',
                toggleLabel: 'Bytt sprak'
            },
            popup: {
                notFound: 'Innhold ble ikke funnet'
            },
            computations: {
                norwegianPlaceholderTitle: 'Norsk versjon kommer snart',
                norwegianPlaceholderBody: 'Oversett denne komponenten i `src/popups/ComputationsIrreversibilityContent.no.tsx`.'
            }
        }
    }
} as const;

export type AppLanguage = keyof typeof resources;

