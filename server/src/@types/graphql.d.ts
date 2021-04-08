import { DocumentNode } from 'graphql';

declare global {
  declare module '*.graphql' {
    const content: DocumentNode;
    export default content;
  }
}
