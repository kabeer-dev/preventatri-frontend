// added due to type error of css or scss files of packages like react-toastify

// Type declarations for CSS imports
declare module '*.css' {
  const content: any;
  export default content;
}

// Type declarations for CSS modules
declare module '*.module.css' {
  const classes: {[key: string]: string};
  export default classes;
}

// Type declarations for SCSS imports
declare module '*.scss' {
  const content: any;
  export default content;
}

// Type declarations for SCSS modules
declare module '*.module.scss' {
  const classes: {[key: string]: string};
  export default classes;
}

// SVGs are imported as React components via @svgr/webpack (see next.config.ts)
declare module '*.svg' {
  import type {FC, SVGProps} from 'react';

  const content: FC<SVGProps<SVGSVGElement>>;

  export default content;
}
