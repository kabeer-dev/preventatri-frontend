// added due to type error of css or scss files of packages like react-toastifyAdd a comment on lines R1 to R10Add diff commentMarkdown input:  edit mode selected.WritePreviewAdd a suggestionHeadingBoldItalicQuoteCodeLinkUnordered listNumbered listTask listMentionReferenceSaved repliesAdd FilesPaste, drop, or click to add filesCancelCommentStart a reviewReturn to codeExpand commentComment on line R1ResolvedCode has comments. Press enter to view.

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
