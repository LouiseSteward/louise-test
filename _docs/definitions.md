---
title: "Definitions"
categories: editing
---

# Definitions

It may be helpful for readers of the book to see glossary terms as they become relevant, as opposed to having to turn or click to the glossary to find out what they mean. When we want to include a definition in a section of text we can use a liquid include tag, that looks like this:
{% raw %}

`{% include definition term="money" %}`

{% endraw %}

This tag gets the definition from the `_data/glossary.yml` file. This one would output the definition of "money" wherever you place it. The placement of glossary terms is determined by the author or editor; when they indicate that the word "money" is important (usually by making a word bold), we should include the definition for money at that point. 

There are a few rules to follow to ensure that the definition is actually included where you want it:

1.  The `_data/glossary.yml` file must be valid yaml (see the [glossary section](glossary.html) of the docs.
2. The term in quotes must match the term in the `_data/glossary.yml` file _exactly_ (it is case, space, and spelling sensitive).
3. In print the term will display in the sidebar in a glossary box. In markdown, you must include the term _above_ the paragraph which you would like it to sit beside.

We can also include multiple glossary terms in one tag separated by a vertical bar, in which case they will be included in the sidebar in print as a single glossary box with multiple terms within it:

{% raw %}

`{% include definition term="law of one price | price gap" %}`

{% endraw %}

This tag includes "law of one price" and "price gap" to produce this in print:

![screen shot 2017-08-24 at 10 52 29](https://user-images.githubusercontent.com/25814064/29658194-623ac030-88ba-11e7-8676-9dd91ed9aac9.png)

We can also add classes to the tag, we can widen a glossary box, for example, by adding a `class="wide"` inside the liquid tag like this:

{% raw %}

`{% include definition term="globalization | offshoring" class="wide" %}`

{% endraw %}

Which will produce this in print:

![screen shot 2017-08-24 at 10 55 40](https://user-images.githubusercontent.com/25814064/29658353-cfb83d2c-88ba-11e7-9281-79af8462036f.png)

**Print caveat**: Given that the glossary include is a sidebar element which attaches to a paragraph that it sits above, if there is no space in the sidebar for the glossary box to sit, the body-text paragraph it is attached to will not be able to sit on that page either. Consequently you will have an unwanted blank space. Fortunately, careful placement of sidebar elements can usually prevent this.

## Popup definitions

Authors and editors often use bold to indicate that a word is important. It may be helpful for readers of the online book to see the definition of an important word as it becomes relevant, as opposed to having to click to the glossary to find out what it means. On the web, it may get messy and distracting to have a lot of sidebar elements, and since we have greater functionality online, we can make use of elements such as pop-up glossary terms.

In the markdown body text we add a tag next to the bold word to connect that word to a glossary term like this:

`**Globalization**{:data-term="globalization"} is the word commonly used to describe our increasingly interconnected world.`

When you scroll over this sentence on the web, it produces a pop up definition for "globalization" that looks like this:

![screen shot 2017-08-24 at 11 10 54](https://user-images.githubusercontent.com/25814064/29658925-ee84589c-88bc-11e7-888c-b2a8a50c2e81.png)

The following rules apply:

1.  The _data/glossary.yml file must be valid yaml (see the [glossary section](https://github.com/fireandlion/core/wiki/Glossary) of the wiki.
2. The term in quotes in the include tag must match the term in the _data/glossary.yml file _exactly_ (it is case, space, and spelling sensitive).

