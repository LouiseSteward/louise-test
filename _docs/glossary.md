---
title: "Glossary"
categories: editing
---

# Glossary

The book's glossary is stored in a YAML file in `_data/glossary.yml`. Glossaries for translations are saved in a subfolder named after the language code, e.g. `_data/fr/glossary.yml` for the French glossary.

To include the entire glossary on a page, use this tag in the markdown:

{% raw %}
```
{% include glossary %}
```
{% endraw %}

Also see the ['Include definition' section](definitions.html) of the docs.

## Converting from spreadsheet

You may receive the manuscript of the glossary as a spreadsheet. To convert that into our YAML:

1. Copy all of and only the cells containing terms, definitions and references.
2. Open a new document in Sublime Text and make sure 'Indent with Spaces' is not selected (bottom right). You want tabs.
3. Paste into the new document.
4. Search for double quote marks `"` and replace with singles `'`. Do this manually, case by case, because you're also looking for instances where an entire definition is enclosed unnecessarily with quote marks, which you don't want – you can remove those quote marks.
5. Replace all tabs with two double quote marks: `""`
6. Turn off word wrap and, using multiple cursors, add this at the start of each line: `- term: "`
7. Run this regex (find, replace):

   ```
   - term: "(.+?)""(.*?)""(.*)
   ```

   ```
   - term: "\1"\n  definition: "\2"\n  cross-reference: "\3"
   ```

8. Paste everything into [yamllint.com](http://yamllint.com) to check that it's valid.
9. Paste that into `_data/glossary.yml`.

