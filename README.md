# Gramps to Markdown

This tool allows to generate Markdown files for all individuals present in a [Gramps](https://gramps-project.org/) family tree. These
files can later be integrated into a website using any
Markdown-compatible static site generator, such as [Gatsby](https://www.gatsbyjs.com/)
or [Jekyll](https://jekyllrb.com/).

## Prerequisites

* Node.js version 16 or later
* A Gramps XML file (with a `.gramps` file extension) exported from Gramps

## Installation

```sh
npm install -g gramps-to-markdown
```

## Usage

```sh
gramps2md inputFilePath [output directory] [options]
```

Examples:

```sh
gramps2md genealogy.gramps
gramps2md genealogy.gramps output
gramps2md genealogy.gramps output '{ "languages": ["en", "fr"] }'
```

### Available options

Options are provided as a JSON object (e.g. `'{ "languages": ["en", "fr"] }'`). The following options are available:

<table>
  <tr>
    <th>Options</th>
    <th>Type</th>
    <th>Default Value</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>languages</td>
    <td>Array</td>
    <td><code>["en"]</code></td>
    <td>
      The language(s) in which to generate markdown files. Currently, only English (<code>"en"</code>) and French (<code>"fr"</code>) are supported.
      If both languages are included, there will be 2 markdown files for every individual in the database, and the
      language codes will be appended to their names.
    </td>
  </tr>
  <tr>
    <td>urlPrefix</td>
    <td>string</td>
    <td><code>""</code></td>
    <td>
      A value to append at the beginning of the URLs of the links
      included in the markdown files. These links point to the pages
      of other individuals (for instance, an individual's parents
      or children). By default, the URL for a link contains only the name
      of the concerned Markdown file (for instance: <code>"I0135.md"</code>).
    </td>
  </tr>
  <tr>
    <td>urlExt</td>
    <td>string</td>
    <td><code>".md"</code></td>
    <td>
      The extension to use (including the dot) in the URLs of the links included in the
      markdown files. This is useful to make sure that the links
      will still work once the Markdown files are converted to HTML files
      to be included in a website (in that case, you could set this option
      to <code>".html"</code>). An empty string can be provided if no file extension should
      be included in the URLs.
    </td>
  </tr>
  <tr>
    <td>includePrivateData</td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>
      Indicates whether or not data marked as private in the Gramps file should be included in the generated Markdown files.
    </td>
  </tr>
  <tr>
    <td>addFrontmatter</td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>
      Set to true in order to include a Markdown
      <a href="https://h.daily-dev-tips.com/what-exactly-is-frontmatter">frontmatter</a>
      containing metadata at the top of each generated
      Markdown file. The frontmatter in each person's file will minimally
      include their ID and their preferred name.
    </td>
  </tr>
  <tr>
    <td>extraFrontmatterFields</td>
    <td>object</td>
    <td><code>{}</code></td>
    <td>
      If <code>addFrontmatter</code> is enabled, this option allows
      to add custom data to the frontmatters of all files. For instance,
      providing <code>"extraFrontmatterFields": {"siteSection": "genealogy"}</code> will add a <code>siteSection</code> field with the <code>genealogy</code> value to every frontmatter.
    </td>
  </tr>  
</table>

This is an extra usage example using all available options:

```sh
gramps2md genealogy.gramps myWebsite/genealogy '{ "urlPrefix": "/genealogy/", "urlExt": ".html", "languages": ["en", "fr"], "includePrivateData": true, "addFrontmatter": true, "extraFrontmatterFields": {"siteSection": "genealogy"} }'
```

## Output Example

This is an example of a Markdown file generated by this tool:

```markdown
# **Brault, Alexis**

## Other Names

* **Breau, Alexis**

## Life Events  

* 🎂 Birth: **1721-09-22** in **Grand-Pré (Acadie), Kings County, Nouvelle-Écosse, Canada**  
* 🪦 Death: **1811-07-16** in **L'Acadie, Saint-Jean-Sur-Richelieu, MRC du Haut-Richelieu, Montérégie, Québec, Canada**  

## Parents

* 👨 Father: [**Brault, François**](I0362.md)  
* 👩 Mother: [**Comeau, Marie**](I0363.md)  

## Families

### With [**Barillot, Marguerite**](I0355.md)

#### Family Events

* 💒 Marriage: **about** **1750** in **Grand-Pré (Acadie), Kings County, Nouvelle-Écosse, Canada**

#### Children

* [**Brault, Charles**](I0290.md)

## Sources

* *Find A Grave - Millions of Cemetery Records*, [http://www.findagrave.com](http://www.findagrave.com)
  * [https://www.findagrave.com/memorial/122154467/alexis-brault](https://www.findagrave.com/memorial/122154467/alexis-brault)
* *WikiTree*, [http://www.wikitree.com/](http://www.wikitree.com/)
  * [https://www.wikitree.com/wiki/Breau-280](https://www.wikitree.com/wiki/Breau-280)

```

Such a file is generated for each person in the provided Gramps file.
An `individuals.md` file containing a list of all individuals with
links to their files is also generated.

## License

Copyright © 2022 Pier-Luc Brault <pier-luc@brault.me>

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.