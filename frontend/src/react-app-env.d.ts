/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly BACKEND_APP_API_BASE_URL?: string;
      readonly REACT_APP_VERSION?: string;

    }
  }

  // declare module '*.module.css' {
  //   const classes: { readonly [key: string]: string };
  //   export default classes;
  // }
  
  // declare module '*.module.scss' {
  //   const classes: { readonly [key: string]: string };
  //   export default classes;
  // }
  
  // declare module '*.module.sass' {
  //   const classes: { readonly [key: string]: string };
  //   export default classes;
  // }

  // declare module '*.module.less' {
  //   const classes: { readonly [key: string]: string };
  //   export default classes;
  // }

  // declare module '*.module.styl' {
  //   const classes: { readonly [key: string]: string };
  //   export default classes;
  // }

  declare module '*.css' {
    const css: { [key: string]: string };
    export default css;
  }

  declare module '*.scss' {
    const css: { [key: string]: string };
    export default css;
  }

  declare module '*.sass' {
    const css: { [key: string]: string };
    export default css;
  }

  declare module '*.less' {
    const css: { [key: string]: string };
    export default css;
  }

  declare module '*.styl' {
    const css: { [key: string]: string };
    export default css;
  }

  declare module '*.png' {
    const src: string;
    export default src;
  }
  
  declare module '*.jpg' {
    const src: string;
    export default src;
  }
  
  declare module '*.jpeg' {
    const src: string;
    export default src;
  }
  
  declare module '*.gif' {
    const src: string;
    export default src;
  }
  
  declare module '*.svg' {
    import * as React from 'react';
  
    export const ReactComponent: React.FunctionComponent<
      React.SVGProps<SVGSVGElement> & { title?: string }
    >;
  
    const src: string;
    export default src;
  }