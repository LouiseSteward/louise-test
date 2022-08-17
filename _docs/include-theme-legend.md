---
title: "Theme legends"
categories: editing
---

# Theme legends

First read the [Include theme-key section](https://github.com/fireandlion/core/wiki/Include-theme-key) of the wiki and then come back to this.

Since we use 'theme-keys' which appear as coloured dots at the beginning of each section which they relate to (for example a green dot indicates that a section talks about the environment), we want to specify to readers what these dots mean in a 'legend', almost like the legend or key on a traditional map. 

At the beginning of a unit we include a 'theme-key legend' which displays all of the colourful dots for the themes used within that unit, as well as the theme name which the dot signifies. For example a green dot will be followed by the word 'environment' in our theme-key legend.

At the start of the unit just after our H1 we use this include tag:

{% raw %}
`{% include theme-legend themes="21, 22" %}`
{% endraw %}

within it we specify the numbers of the themes which we wish to include, which should match the numbers of all of the themes included within that unit. The include tag above says 'include the coloured dots for themes 21 and 22, those are the only themes used in this unit'.


