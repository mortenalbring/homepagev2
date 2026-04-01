import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // For a user GitHub Pages site (mortenalbring.github.io), root base is correct.
    // If this becomes a project page, set base to '/<repo-name>/'.
    base: '/'
});

