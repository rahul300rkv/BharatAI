declare module 'svg-pathdata' {
  export class SVGPathData {
    constructor(path: string);
    commands: any[];

    encode(): string;

    static parse(path: string): any[];
  }
}
