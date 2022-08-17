---
title: "Theme keys"
categories: editing
---

# Theme keys

_The Economy_ makes use of a number of 'Capstone' themes as visual identifiers for the content of a subsection. For example, to indicate that subsection 7.12 contains information about the environment, a green dot sits above that H2. 

In `book/styles` we have specified the details about what these dots look like in terms of topic (the theme), colour, and size, as well as a number which each theme is attached to.

Then, in the markdown for that particular unit, above the section opener for which we want to attach a themed dot, we use this liquid tag:

`{% include theme-key themes="17, 22" %}`

this says to include dots for themes 17 and 22 above what ever comes after the include tag in the markdown. 