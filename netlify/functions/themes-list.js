const { THEMES } = require("./_utils/themes");
const { successResponse, errorResponse, handleCors } = require("./_utils/helpers");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return handleCors();
  if (event.httpMethod !== "GET") return errorResponse("Method not allowed", 405);

  const themes = Object.values(THEMES).map((theme) => ({
    name: theme.name,
    label: theme.label,
    description: theme.description,
    colors: theme.colors,
    fontHeading: theme.fontHeading,
    fontImport: theme.fontImport,
    borderRadius: theme.borderRadius,
    buttonStyle: theme.buttonStyle,
  }));

  return successResponse({ themes });
};