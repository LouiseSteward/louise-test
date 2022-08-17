---
title: "Slidelines"
categories: editing
---

# Slidelines

This book uses slides (or 'slidelines') to explain complex figures step by step.

Slides are sets of multiple figures. In the markdown source for each figure, we can define the following information:

* one or more images
* html (e.g. for complex tables like Figure 1.9b)
* markdown (e.g. for simple tables like Figure 1.9a)
* a reference (e.g. 'Figure 1.2a')
* a caption
* a title
* a description
* a source
* a class (for styling purposes).

The software then uses that information differently depending on the output format. For instance, on the web and in the epub, the description is the text that screen-readers will read aloud to blind users who can't see an image, and we don't need to display it in print. The caption and description are similar, but not the same. A caption usually provides meta-information about an image, while a description describes the appearance of the image.

In markdown, we create a slideline by grouping a sequence of figures in a div. Before the first figure add

`<div class="slides">`

and after the last figure add

`</div>`

On the web (when we design the web version), we expect the slidelines will work much like they do on the current site: each slide includes an image, an optional title, and a caption; and the user can click through each slide.

**A slideline must contain** at least one figure, preferably the first one, with `class="summary"`. This is the figure that is included in the print edition in full. The other slides, in print, are represented only by their title and description.

### Troubleshooting

In print, when there are four slides, there is a chance they fall into the first two columns, leaving the third blank. We can only control for this manually, adding a `column-break-after` class to one of the figures in `.slides`. I.e. in the `include` parameters, add `class="column-break-after"`.
