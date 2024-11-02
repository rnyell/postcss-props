import type { PluginCreator, Root, AtRule } from "postcss";
// import { Warning } from "postcss";
import Issue from "./issue.js";
import { getParams, removeAtRule } from "./utils.js";

interface Props {
  [property: string]: string;
}

export interface PluginOptions {
  strictMode: boolean;
  keepProps: boolean;
  keepDumps: boolean;
}

const plugin: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
  const defaults: PluginOptions = {
    strictMode: true,
    keepProps: false,
    keepDumps: false,
  };

  const options = Object.assign(defaults, opts);
  const { strictMode, keepProps, keepDumps } = options;

  const props = new Map<string, Props>();

  return {
    postcssPlugin: "postcss-props",

    Once(root: Root, { Declaration, result }) {
      root.walkAtRules("props", (atRule: AtRule) => {
        const issue = new Issue(atRule, result, strictMode);
        const identifier = atRule.params.trim();
        const declarations: Props = {};

        if (!atRule.nodes) {
          issue.handler("warn", "empty block", identifier);
          removeAtRule(atRule, keepProps);
          return;
        } else if (atRule.nodes.length === 0) {
          issue.handler("warn", "empty declaration", identifier);
          removeAtRule(atRule, keepProps);
          return;
        } else if (identifier.includes("\n") || identifier.includes("@")) {
          issue.handler("error", "unexpected token");
        }

        for (const node of atRule.nodes) {
          if (node.type === "decl") {
            declarations[node.prop] = node.value;
          } else if (node.type === "atrule") {
            if (node.name === "props") {
              //..
            }
          } else if (node.type === "rule") {
            issue.handler("error", "nested rules");
          }
        }

        props.set(identifier, declarations);
        removeAtRule(atRule, keepProps);
      });

      root.walkAtRules("dump", (atRule: AtRule) => {
        const issue = new Issue(atRule, result, strictMode);
        const identifier = getParams(atRule.params);

        if (identifier === null) {
          issue.handler("warn", "argless dump");
          removeAtRule(atRule, keepDumps);
          return;
          // if (strictMode) {
          //   // throw atRule.error(ERROR_MESSAGES.warn("argless dump"));
          // } else {
          //   // atRule.warn(result, ERROR_MESSAGES.warn("argless dump"));
          //   return;
          // }
        }

        const declarations = props.get(identifier);

        if (!declarations) {
          issue.handler("warn", "undefined identifier", identifier);
          removeAtRule(atRule, keepDumps);
          return;
          // if (strictMode) {
          //   // throw atRule.error(ERROR_MESSAGES.error("undefined identifier"));
          // } else {
          //   // atRule.warn(result, ERROR_MESSAGES.error("undefined identifier"));
          // }
        }

        for (const prop in declarations) {
          const declaration = new Declaration({
            prop: prop,
            value: declarations[prop] as string,
          });

          atRule.before(declaration);
        }

        removeAtRule(atRule, keepDumps);
      });
    },
  };
};

plugin.postcss = true;

export default plugin;
