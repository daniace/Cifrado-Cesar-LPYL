export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    nombre_usuario: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};
