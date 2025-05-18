interface ImportMetaEnv {
    VITE_APP_APPID: string;
    VITE_APP_REGION_ID : string;
    VITE_APP_API_KEY :string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Augment the global ImportMeta interface
declare global {
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}


export const appId =  import.meta.env.VITE_APP_APPID;
export const region = import.meta.env.VITE_APP_REGION_ID;
export const apiKey = import.meta.env.VITE_APP_API_KEY;
