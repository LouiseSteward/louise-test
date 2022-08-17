---
title: "Bibliography"
categories: editing
---

# Bibliography

The book's bibliography is stored in a YAML file in `_data/bibliography.yml`. Bibliographies for translations are saved in a subfolder named after the language code, e.g. `_data/fr/bibliography.yml` for the French bibliography.

In the print book and on the web, references are included at the end of each unit/chapter which they relate to, as well as in total at the end of the whole book.

The `bibliography.yml` file uses YAML syntax (which you can validate [here](http://www.yamllint.com/)). An entry looks like this:

```
- reference: "Ackerman, Frank. 2007. [‘Debating climate economics: the Stern Review vs. its critics’](https://tinyco.re/5699873){:.show-url}. Report to Friends of the Earth, July 2007."
  units:
    - "20"
```

The reference 'cascades' such that following a hyphen and `reference: ` the reference is included in double quotes (consequently any quotes required in the reference itself should be single quotes, or unicode curly double quotes). Under the reference comes `units:` and under that a hyphen followed by the unit which the reference applies to in double quotes. If the reference applies to Units 19, 20 and 21 we would use:

```
  - reference: "Ackerman, Frank. 2007. [‘Debating climate economics: the Stern Review vs. its critics’](https://tinyco.re/5699873){:.show-url}. Report to Friends of the Earth, July 2007."
    units:
      - "19"
      - "20"
      - "21"
```

All of the references contained in `bibliography.yml` will be included at the end of the book, and by storing them all in one file we can standardise reference style, avoid duplicate references and monitor the occurrence of references across all units. 

The units specified in each entry in `bibliography.yml` say which units this reference applies to. Then, when we use the bibliography include tag at the end of a unit (usually following a heading like `## 8.12 References`) that tag fetches all of the references specified for that unit and includes them.

So the tag to output only the bibliography for Unit 18 is: 

{% raw %}
```
{% include bibliography unit="18" %}
```
{% endraw %}

## References in sidenotes

Some references only appear in notes, not in the bibliography.

These appear in the sidebar in print and as pop-ups on screen. (Unless a user's Javascript is off, in which case they appear at the end of the unit as a backup.)

We apply `[^1]` to the end of a sentence or paragraph to which we want to attach a pop-up footnote on web and a sidenote reference in print. Then we include the reference just after the paragraph like this:

`[^1]: This is explained in more detail in ['Who’s in Charge?'](https://tinyco.re/9867111){:.show-url}, Chapter 1 of Paul Seabright's book on how market economies manage to organize complex trades among strangers (follow the link to access Chapter 1 as a pdf). Paul Seabright. 2010. *The Company of Strangers: A Natural History of Economic Life* (Revised Edition). Princeton, NJ: Princeton University Press.`

So ultimately we have:

```
This is because, in some conditions, prices provide an accurate measure of the scarcity of a good or service.[^1]

[^1]: This is explained in more detail in ['Who’s in Charge?'](https://tinyco.re/9867111){:.show-url}, Chapter 1 of Paul Seabright's book on how market economies manage to organize complex trades among strangers (follow the link to access Chapter 1 as a pdf). Paul Seabright. 2010. *The Company of Strangers: A Natural History of Economic Life* (Revised Edition). Princeton, NJ: Princeton University Press.
```

where the first part is the body text with a footnote attached, and the second part specifies what is inside the footnote. Each footnote within a unit should have a distinct number, the same number should be used when specifying the content of the footnote (just like we have used the number 1 above). 

See the page on [Footnotes, endnotes and sidenotes](notes.html) for more detail on notes.
