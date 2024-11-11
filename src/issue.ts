import type { Result, Node } from "postcss";
// import { Warning } from "postcss";


type WarningName = "empty block" | "empty declaration" | "argless dump";

type ErrorName = "unexpected token" | "undefined identifier" | "nested rules" | "nested props";

type IssueName = WarningName | ErrorName;

type IssueType = "warn" | "error";

const MESSAGES = {
  "empty block": (id: string) =>
    `\n The "${id}" @props is defined without any declaration block. \n`,
  "empty declaration": (id: string) =>
    `\n The "${id}" @props is defined but has an empty declarations. \n`,
  "argless dump": () => `\n @dump is used without any argument. \n`,
  "unexpected token": () =>
    `\n\n > Something went wrong! it may because of using props without curly braces or semicolon \n\t e.g. @props x \n\n\t the correct forms: \n\t\t @props x; \n\t\t @props x { } \n\t\t @props x { /*styles*/ } \n`,
  "undefined identifier": (id: string) =>
    `\n\n > The identifier with name: "${id}" is not defined; \n   spell check your @dump arg or make sure the "${id}" is defined via @props \n`,
  "nested rules": () =>
    `\n You can't nest rule inside @props. Only declarations are allowed. \n`,
  "nested props": () =>
    `\n You can't nest @props inside @props. You can extend them if you want. \n`,
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
