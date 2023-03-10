const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const slugify = require("slugify");

yargs(hideBin(process.argv))
  .command(
    "new [title]",
    "create a new post in the given section",
    (yargs) => {
      return yargs
        .positional("title", {
          describe: "post title",
          default: "Untitled",
        })
        .option("section", {
          alias: "s",
          type: "string",
          default: "carnet",
        })
        .option("lang", {
          alias: "l",
          type: "string",
          default: "fr",
        });
    },
    (argv) => {
      const date = new Date();
      const year = date.getFullYear();
      const dateSlug = date.toJSON().substring(0, 10);
      const slug = slugify(argv.title, {
        lower: true,
        strict: true,
        locale: "fr",
        trim: true,
      });
      const dir = `_posts/${argv.section}/${year}`;
      const path = `${dir}/${dateSlug}-${slug}.md`;
      try {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(
          path,
          template(argv.title, dateSlug, argv.section, argv.lang)
        );
        console.info(`Created file ${path}.`);
      } catch (err) {
        console.error(`Unable to create ${path}: ${err}`);
      }
    }
  )
  .parse();

function template(title, dateSlug, section = "carnet", lang = "fr") {
  return `---
title: ${title}
excerpt:
lang: ${lang || "fr"}
date: ${dateSlug}
category: ${section}
tags:
image:
---

`;
}
