import inquirer from "inquirer";

inquirer.registerPrompt("search-list", require("inquirer-search-list"));

export { inquirer };
