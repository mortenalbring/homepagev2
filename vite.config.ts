import react from '@vitejs/plugin-react';
import type {UserConfig} from 'vite';

const config: UserConfig = {
    plugins: [react()],
    // For a user GitHub Pages site (mortenalbring.github.io), root base is correct.
    // If this becomes a project page, set base to '/<repo-name>/'.
    base: '/',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split vendor libraries
                    'vendor-react': ['react', 'react-dom', 'react-i18next', 'react-router-dom'],
                    'vendor-syntax': ['react-syntax-highlighter'],
                    'vendor-mathjax': ['better-react-mathjax'],
                    // Split popup components into individual chunks for better lazy loading
                    'popup-blog': ['./src/popups/blog/BlogComponent.tsx'],
                    'popup-contact': ['./src/popups/contact/ContactComponent.tsx'],
                    'popup-portfolio': ['./src/popups/PortfolioContent.tsx'],
                    'popup-mortsweeper': ['./src/popups/mortsweeper/MortsweeperContent.tsx'],
                }
            }
        },
        // Increase chunk size warning limit for known large libraries
        // react-syntax-highlighter is inherently large (~900KB) but is properly code-split
        chunkSizeWarningLimit: 1000
    }
};

export default config;
