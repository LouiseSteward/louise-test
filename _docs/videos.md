---
title: "Videos"
categories: editing
---

# Videos

You can add a YouTube or Vimeo video with our {% raw %}`{% include youtube %}`{% endraw %} and {% raw %}`{% include vimeo %}`{% endraw %} tags. E.g.:

{% raw %}
```
{% include youtube
    id="FrIhloNEwT8"
    image="youtube-FrIhloNEwT8.jpg"
    link="https://youtu.be/FrIhloNEwT8"
    description="Juliet Schor: Why do we work so hard?"
%}
```
{% endraw %}

* The `id` is the string (usually about 11 characters) that YouTube and Vimeo use to identify the video. It's in the the URL for the video.
* The `image` is the image you want to appear in the print and epub versions of the book. For instance, take a screenshot of the video at a suitable point.
* The `link` is the URL that a user should enter into their browser to see the video. For CORE videos, this is usually a `tinyco.re` link, such as `https://tinyco.re/7406838`, which redirects to the YouTube video.
* The `description` is like a caption: the text you want to appear alongside the screenshot in the book. It might be the same text that appears on YouTube below the video.

By default, this will put a thumbnail and link in the sidebar in print. We're still developing the styling for screen, it may be on the side or in the main text.

If you definitely want the video to appear in the running text, in print and on screen, then add `class="featured"` to the tag parameters. E.g.

{% raw %}
```
{% include youtube 
    id="iEHQR1fG0_g"
    image="youtube-iEHQR1fG0_g.jpg"
    link="https://youtu.be/iEHQR1fG0_g"
    description="Suresh Naidu: How population, technology and politics created the real wage hockey stick." 
    class="featured"
%}
```
{% endraw %}

