---
title: "Links and cross-refs"
categories: editing
---

# Links and cross-refs

On screen, links to other places in the text and to other sites are simply clickable text. How do we display those links in print?

What we want is to be able to display the URL or page reference of a link on the printed page.

### Linking to external sites

To make a link display its URL in print, add `{:.show-url}` to any markdown link. In print, this will make the URL appear in parentheses after the link text.

Explanation:

* The manuscript includes many links to external resources without explicitly displaying the tinyco.re URL. In print, we need a mechanism for showing the actual URL explicitly, so that people can enter it into a browser manually – unlike on the web and in the epub, where the text will simply remain a clickable hyperlink. 
* Moreover, the URL should only be shown when it's appropriate. For instance, we do not want the URL showing on internal hyperlinks that are cross references (e.g. to figures) or on some external hyperlinks that are not essential enough to be worth distracting the reader for (e.g. the phrase 'the work of Angus Maddison' is a link, but we've not shown that URL in that case).
* So we've created a class that can be added to any link in the markdown *if* that link should be displayed explicitly in print output:

  `In this sentence, [this](http://example.com){:.show-url} is a link.`

### Page cross-references

Add `{:.show-page-number}` immediately after an internal link. In print, this will display the page reference in parentheses after the link text.

If the figure is on the same page as the reference, the page reference will *not* show.

How to add the link/reference:

- An internal link to somewhere *in the same document* starts with a `#`, followed by the `id` of the element you're linking to.
- All figures have an ID that is the slug of their reference. E.g. 'Figure 12.2' has an ID of `figure-12-2`. 
- So to link to that within unit 12, you'd write `See [Figure 12.2](#figure-12-2).`
- And to add the page reference, `See [Figure 12.2](#figure-12-2){:.show-page-number}.`
- Internal links to other documents (e.g. units) must include the HTML filename of the unit you're linking to. E.g. from unit 1, you'd write `See [Figure 12.2](12.html#figure-12-2).`