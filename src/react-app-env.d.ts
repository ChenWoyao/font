declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}


interface Window {
    location: Location;
}
