// lib/generateTypes.ts
import {
  TextField,
  RichTextField,
  LinkField,
  ImageField,
} from "@sitecore-jss/sitecore-jss-nextjs";

export function generateTypeDefinitions(
  baseName: string,
  jsonData: any
): string {
  let typeDefinitions = `import { TextField, RichTextField, LinkField, ImageField,Field } from "@sitecore-jss/sitecore-jss-nextjs";\n\n`;

  function containsHtml(value: string): boolean {
    // Basic HTML tag detection logic; this can be enhanced as needed
    const pattern = /<\/?[a-z][\s\S]*>/i;
    return pattern.test(value);
  }

  function isLinkField(data: any): boolean {
    return (
      typeof data === "object" &&
      data !== null &&
      (data.hasOwnProperty("href") || data.hasOwnProperty("url"))
    );
  }

  function isImageField(data: any): boolean {
    return (
      typeof data === "object" &&
      data !== null &&
      data.hasOwnProperty("src") &&
      data.hasOwnProperty("alt") &&
      data.hasOwnProperty("width") &&
      data.hasOwnProperty("height")
    );
  }

  function determineFieldType(data: any, key: string): string {
    // Special handling for params to always be a dictionary
    if (key === "params") {
      return "{ [key: string]: string }";
    }
    if (data === null) {
      return "null"; // Return "null" for null values
    }
    if (typeof data === "object" && data !== null) {
      if (data.hasOwnProperty("value")) {
        if (typeof data.value === "string") {
          return containsHtml(data.value) ? "RichTextField" : "TextField";
        } else if (typeof data.value === "boolean") {
          return "Field<boolean>";
        } else if (isLinkField(data.value)) {
          return "LinkField";
        } else if (isImageField(data.value)) {
          return "ImageField";
        } else {
          return "Field<any>";
        }
      }
      return "any"; // default object type for complex objects
    } else {
      switch (typeof data) {
        case "string":
          return "string";
        case "number":
          return "number";
        case "boolean":
          return "boolean";
        default:
          return "any";
      }
    }
  }

  function parseJsonAndCreateTypes(
    name: string,
    data: any,
    isArrayElement = false
  ) {
    let fields = "";
    let typeName = isArrayElement ? `${name}Fields` : name; // Adjusted to use Fields suffix for clarity

    if (data === null || typeof data === "undefined") {
      fields += `  ${name}?: any;\n`;
    } else {
      Object.keys(data).forEach((key) => {
        const fieldType = determineFieldType(data[key], key);

        const newName = `${typeName}${
          key.charAt(0).toUpperCase() + key.slice(1)
        }`;

        if (
          fieldType === "TextField" ||
          fieldType === "RichTextField" ||
          fieldType === "Field<boolean>" ||
          fieldType === "LinkField" ||
          fieldType === "ImageField" ||
          fieldType === "Field<any>" ||
          fieldType === "null" ||
          fieldType === "{ [key: string]: string }" // Handling for params
        ) {
          fields += `  ${key}?: ${fieldType};\n`;
        } else if (typeof data[key] === "object" && !Array.isArray(data[key])) {
          parseJsonAndCreateTypes(newName, data[key], false);
          fields += `  ${key}?: ${newName};\n`;
        } else if (Array.isArray(data[key])) {
          if (data[key].length === 0) {
            fields += `  ${key}?: any[];\n`; // Handle empty arrays as any[]
          } else {
            parseJsonAndCreateTypes(`${newName}`, data[key][0] || {}, true);
            fields += `  ${key}?: ${newName}Fields[];\n`; // Correctly appending 'Fields' and using [] for array
          }
        } else {
          fields += `  ${key}?: ${fieldType};\n`;
        }
      });
      typeDefinitions += `type ${typeName} = {\n${fields}};\n\n`;
    }
  }

  parseJsonAndCreateTypes(baseName, jsonData);
  return typeDefinitions;
}
