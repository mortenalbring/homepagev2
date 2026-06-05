export const resources = {
    en: {
        translation: {
            language: {
                current: 'English',
                toggleLabel: 'Switch language'
            },
            popup: {
                notFound: 'Content not found',
                loading: 'Loading…'
            },
            taskbar: {
                start: 'Start'
            },
            startMenu: {
                programs: 'Programs',
                documents: 'Documents',
                settings: 'Settings',
                find: 'Find',
                help: 'Help',
                run: 'Run...',
                shutdown: 'Shut Down...'
            },
            folderWindow: {
                menu: {
                    file: 'File',
                    edit: 'Edit',
                    view: 'View',
                    help: 'Help'
                },
                back: 'Back',
                up: 'Up',
                empty: 'This folder is empty',
                objects_one: '{{count}} object',
                objects_other: '{{count}} objects'
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
                toggleLabel: 'Bytt språk'
            },
            popup: {
                notFound: 'Fant ikke innhold',
                loading: 'Laster…'
            },
            taskbar: {
                start: 'Start'
            },
            startMenu: {
                programs: 'Programmer',
                documents: 'Dokumenter',
                settings: 'Innstillinger',
                find: 'Søk',
                help: 'Hjelp',
                run: 'Kjør...',
                shutdown: 'Avslutt...'
            },
            folderWindow: {
                menu: {
                    file: 'Fil',
                    edit: 'Rediger',
                    view: 'Vis',
                    help: 'Hjelp'
                },
                back: 'Tilbake',
                up: 'Opp',
                empty: 'Denne mappen er tom',
                objects_one: '{{count}} objekt',
                objects_other: '{{count}} objekter'
            },
            computations: {
                norwegianPlaceholderTitle: 'Norsk versjon kommer snart',
                norwegianPlaceholderBody: 'Oversett denne komponenten i `src/popups/ComputationsIrreversibilityContent.no.tsx`.'
            }
        }
    }
} as const;

export type AppLanguage = keyof typeof resources;

