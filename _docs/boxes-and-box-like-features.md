---
title: "Boxes"
categories: editing
---

# Boxes

The book includes many kinds of boxes and box-like features. These must be named and tagged consistently.

{% raw %}
| Name | Class in markdown | Notes
|---|---|---|
| Great economists | `.great-economist` or `.great-economists` |  |
| When economists disagree | `.economist` or `.economists` |  |
| How economists learn from facts | `.economist` or `.economists` |  |
| Einstein | `.einstein` |  |
| Economist in action |  | Refers to certain CORE videos
| Question | `.question` | Should only be added using the `{% include question file="foo" %}` tag.
| Exercise | `.exercise` | Exercise boxes can if absolutely necessary be moved to the sidebar in print by adding `.pdf-sidebar`.
| Info | `.info` | Appears in the sidebar. Can be widened into the text area with `.wide`.
| Sidenote | `.sidenote` | Appears in the sidebar. Can be widened into the text area with `.wide`.
| Definition | `.definition` | Only created with a `{% include definition term="foo" %}` tag. Appears in sidebar. Can be widened by adding `class="wide"` to the tag, or set full-width across the bottom of a page by adding `class="full-width"` to the tag.
| Video | `.video` | Can only be added using the `{% include youtube %}` or `{% include vimeo %}` tags.
{% endraw %}