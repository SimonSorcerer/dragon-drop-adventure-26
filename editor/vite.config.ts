import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: { port: 5174 },
    resolve: {
        alias: {
            '@type': path.resolve(__dirname, '../src/types'),
        },
    },
});
