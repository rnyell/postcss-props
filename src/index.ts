import type { PluginCreator, Root, AtRule } from "postcss";
import { getParams } from "./utils.js";

interface Props {
  [property: string]: string;
}

export interface PluginOptions {
  strictMode: boolean;
  keepProps: boolean;
  keepDumps: boolean;
}

function removeAtRule(atRule: AtRule, opt: boolean) {
  if (!opt) {
    atRule.remove();
  }
}


const plugin: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
  const defaults: PluginOptions = {
    strictMode: true,
    keepProps: false,
    keepDumps: false,
  };

  const options = Object.assign(defaults, opts);

  const props = new Map<string, Props>();

  return {
    postcssPlugin: "postcss-props",

    Once(root: Root, { Declaration, result }) {
      root.walkAtRules("props", (atRule: AtRule) => {
        const identifier = atRule.params.trim();
        const declarations: Props = {};

        if (!atRule.nodes) {
          atRule.warn(
            result,
            `The "${identifier}" @props is defined without any declaration block`,
          );
          removeAtRule(atRule, options.keepProps);
          return;
        } else if (atRule.nodes.length === 0) {
          atRule.warn(
            result,
            `The "${identifier}" @props is defined but has an empty declarations`,
          );
          removeAtRule(atRule, options.keepProps);
          return;
        } else if (identifier.includes("\n") || identifier.includes("@")) {
          throw atRule.error(
            `\n\n > Something went wrong! it may because of using props without curly braces or semicolon \n\t e.g. @props x \n\n\t the correct forms: \n\t\t @props x; \n\t\t @props x { } \n\t\t @props x { /*styles*/ } \n`,
          );
        }

        for (const node of atRule.nodes) {
          if (node.type === "decl") {
            declarations[node.prop] = node.value;
          } else {
            const msg = "You can't nest rule & at-rules (such as @props or @media) inside @props."
            if (options.strictMode) {
              throw atRule.error(msg);
            } else {
              atRule.warn(result, msg);
            }
          }
        }

        props.set(identifier, declarations);
        removeAtRule(atRule, options.keepProps);
      });

      root.walkAtRules("dump", (atRule: AtRule) => {
        const identifier = getParams(atRule.params);

        if (identifier === null) {
          if (options.strictMode) {
            throw atRule.error(`\n\n > no arg is passed to @dump()`);
          } else {
            atRule.warn(result, `\n\n > no arg is passed to @dump()`);
            removeAtRule(atRule, options.keepDumps);
            return;
          }
        }

        const declarations = props.get(identifier);

        if (!declarations) {
          if (options.strictMode) {
            throw atRule.error(
              `\n\n > The identifier with name: "${identifier}" is not defined; \n   spell check your @dump arg or make sure the "${identifier}" is defined via @props \n`,
              { word: identifier }
            );
          } else {
            atRule.warn(
              result,
              `\n\n > The identifier with name: "${identifier}" is not defined; \n   spell check your @dump arg or make sure the "${identifier}" is defined via @props \n`,
            );
            removeAtRule(atRule, options.keepDumps);
            return;
          }
        }

        for (const prop in declarations) {
          const declaration = new Declaration({
            prop: prop,
            value: declarations[prop] as string,
          });

          atRule.before(declaration);
        }

        removeAtRule(atRule, options.keepDumps);
      });
    },
  };
};

plugin.postcss = true;

export default plugin;
