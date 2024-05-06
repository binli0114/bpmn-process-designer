import zhCN from "./zh-cn";
import enAU from "./en-AU";

export function customTranslate(template, replacements) {
  replacements = replacements || {};

  // Translate
  template = enAU[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || "{" + key + "}";
  });
}

export default {
  translate: ["value", customTranslate]
};
