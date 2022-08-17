---
title: "Figures"
categories: editing
---

# Figures

*Also see [Images](images.html)*

A figure is essentially an image and a caption, but it can be much more. To include a figure, start with this simple tag:

{% raw %}

`{% include figure %}`

{% endraw %}

Then, inside that tag after the word `figure`, you add extra info, depending what you need it to include.

In the tag for each figure, we can define the following information:

* one or more images
* html (e.g. for complex tables like Figure 1.9b)
* markdown (e.g. for simple tables like Figure 1.9a)
* a reference (e.g. 'Figure 1.2a'; appears in front of the caption)
* a link (clicking the image opens this link, instead of the default that opens the full image)
* a caption (appears below the image)
* a title (appears in online slidelines above the description)
* a description (appears in online slidelines)
* a source (appears below the figure)
* a [class](#classes) (sets the layout of a given figure).

The software then uses that information differently depending on the output format. For instance, on the web and in the epub, the description is the text that screen-readers will read aloud to blind users who can't see an image, and we don't need to display it in print. The caption and description are similar, but not the same. A caption usually provides meta-information about an image, while a description describes the appearance of the image. Descriptions are also displayed in [slidelines](https://github.com/fireandlion/core/wiki/Slides).

We define these things in the tag using 'parameters'. For instance, we set the `image` parameter by writing `image='mydog.jpg'`. Here is a `figure` include with each parameter set. You can copy this and set the value in each parameter. Nothing is mandatory, so you only need to include the parameters that your figure needs defined; but we highly recommend including a reference and a description. The empty parameters should be deleted as there are rare occasions where using an empty parameter can affect layout.

**It's critical that figure `reference`s are unique in each document.** They become `id`s in the output HTML, and `id`s must be unique in an HTML document. This is also required for our slides Javascript to work, because when a user clicks on a slide thumbnail, the unique `id` tells the script what image to show.

{% raw %}

```
{% include figure
   images="mydog.jpg, yourdog.jpg"
   html="<table></table>"
   markdown="A *bad* example."
   reference="Figure 1.2a"
   link="http://example.com"
   caption="This is the figure caption."
   title="My Example Figure"
   description="This should describe what the images look like."
   source="CORE wiki, Fire and Lion, 2017"
   class="example-classname"
%}
```

{% endraw %}

Note the double quotes. If the text you're adding to a parameter contains quotes, you'd use single quotes in the text – or vice versa. Do not mix single and double quotes, or the software won't know where the parameter ends. If you must use, say, double quotes inside the quotes around a parameter, use the actual unicode glyphs for curly quotes, `“` and `”`. For instance, all of these are okay:

```
caption="Mention of the word 'capitalism' in New York Times articles'"
caption='Mention of the word "capitalism" in New York Times articles.'
caption="Mention of the word “capitalism” in New York Times articles."
```

### Classes

* `class="wide"` makes the figure stretch the full page width, beyond the main text area.
* `class="summary"` only applies to [slidelines](slides.html). Must be added to the first figure in a slideline to make it appear in print.
* `class="thumbnail"` puts the figure in miniature in the sidebar. Used mainly for later references back to a figure, to save the reader having to flip back to see the figure again.