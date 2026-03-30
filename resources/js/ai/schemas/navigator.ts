const tools = [
  {
    type: "function",
    function: {
      name: "navigateTo",
      description: "Navigates the user to a specific page on the website.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            enum: ["/dashboard", "/billing", "/settings", "/support"],
            description: "The internal URL path to redirect to.",
          },
        },
        required: ["path"],
      },
    },
  },
];

export default tools;
