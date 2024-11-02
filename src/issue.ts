import type { Result, Node } from "postcss";

type WarningName = "empty block" | "empty declaration" | "argless dump";

type ErrorName = "unexpected token" | "undefined identifier" | "nested rules";

type IssueName = WarningName | ErrorName;

type IssueType = "warn" | "error";

const MESSAGES = {
  "empty block": (id: string) =>
    `The "${id}" @props is defined without any declaration block.`,
  "empty declaration": (id: string) =>
    `The "${id}" @props is defined but has an empty declarations.`,
  "argless dump": () => `@dump is used without any argument.`,
  "unexpected token": () =>
    `\n\n > Something went wrong! it may because of using props without curly braces or semicolon \n\t e.g. @props x \n\n\t the correct forms: \n\t\t @props x; \n\t\t @props x { } \n\t\t @props x { /*styles*/ } \n`,
  "undefined identifier": (id: string) =>
    `\n\n > The identifier with name: "${id}" is not defined; \n   spell check your @dump arg or make sure the "${id}" is defined via @props \n`,
  "nested rules": () =>
    `You can't nest rule inside @props. Only declarations are allowed.`,
};

export default class Issue {
  private node: Node;
  private result: Result;
  private strict: boolean;

  constructor(node: Node, result: Result, strict: boolean) {
    this.node = node;
    this.result = result;
    this.strict = strict;
  }

  private getMessage(name: IssueName, id: string = "") {
    return MESSAGES[name](id);
  }

  private warn(name: IssueName, id?: string) {
    const message = this.getMessage(name, id);
    this.node.warn(this.result, message);
  }

  private error(name: IssueName, id?: string) {
    const message = this.getMessage(name, id);
    throw this.node.error(message);
  }

  handler(type: IssueType, name: IssueName, id?: string) {
    const isError = this.strict || type === "error";

    if (isError) {
      this.error(name, id);
    } else {
      this.warn(name, id);
    }
  }
}
