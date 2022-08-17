---
title: "Converting manuscript to markdown"
categories: technical
---

# Converting manuscript to markdown

Have PDF manuscript handy (i.e. a PDF created by the authors with images embedded).

1. Convert docx to markdown with Pandoc:

   `pandoc -S -f docx -t markdown filename.docx --output=filename.md --atx-headers --wrap=none --toc --extract-media=""`

   where `filename` is the name of the file you're converting.

2. Add YAML frontmatter
3. Remove escape slashes:
   1. `\#` at headings
   2. `\*` at bullets
   3. `\.` at numbered lists
   4. `\$` at US-dollar signs *outside* MathJax blocks
   5. `\[`, `\]`, `\(`, `\)` at links (this regex will help: `\\\[(.+?)\\\]\((.+?)\)`)

4. Clean up the MathJax:
   1. Replace the delimiters `\$` and `\$\$` with `$$`
   2. *Do not* remove the slash before a US-dollar sign *inside* MathJax blocks.
   3. Remove `\\` which is an escape slash ahead of a slash (e.g. `\\frac` should be `\frac`)

5. Watch for glossary definitions, which are terms the authors have made bold. Above the paragraph that they appear in, add a definition include: {% raw %}`{% include definition term="" %}`{% endraw %}, where you put the term being defined inside the quotes. Sometimes the authors will use the plural when you need to define the singlar, e.g. `firms` in text but {% raw %}`{% include definition term="firm" %}`{% endraw %}. The glossary is in `_data/glossary.yml`.
6. Turn YouTube links into YouTube includes.
7. If the author has used markdown incorrectly, fix it up. E.g. use the `{:.show-url}` tag to display links in print that on the screen (web, epub) will be clickable text, rather than explicitly making the URL text the visisble, clickable text on screen.
8. Authors may have added markdown tags like `{:.sidenote}`. Pandoc would have put a blank line between them and the text they apply to, and you'll need to take that line out. (Find `\n\n{:`, replace `\n{:`.)
9. Manually create markdown as needed, e.g. for elements like MCQs, exercises and various kinds of boxes. Refer to units 1 to 3 for examples.

## Snippets

### Blank figure

{% raw %}
```
{% include figure
   images=""
   html=""
   markdown=""
   reference=""
   link=""
   caption=""
   title=""
   description=""
   source=""
   class=""
%}
```
{% endraw %}

### Definition include

{% raw %}
```
{% include definition term="" %}
```
{% endraw %}

### Blank YouTube include

Note, the link might be the `tinyco.re` link in the manuscript, but the ID must be the YouTube ID in the YouTube URL.

The image must be manually created from a large, qood-quality screenshot.

{% raw %}
```
{% include youtube 
    id=""
    image=""
    link=""
    description=""
%}
```
{% endraw %}

### Useful regex

Find figures and add an internal link (only works for same unit, and not for figures with letters at the ends of references):

`Figure (\d{1,2})\.(\d{1,2})`

`[Figure \1.\2](#figure-\1-\2)`

Find empty parameters in includes:

`\n\s+[a-z]+=""`
