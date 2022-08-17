---
title: "Navigation"
category: editing
---

# Navigation

In web output, the nav (contents) menu is controlled from the `_data/meta.yml` file, in the `nav` section. For each item in the menu, you must set at least a `file` value (which file should be opened on click) and a `label` value (what the link text should say). To link to a point within a file (such as an `h2` halfway down the page), also set an `id` value.

## Using the nav-builder script

1. Go to [this gist](https://gist.github.com/arthurattwell/9eee6538411ac228d0caf33ed13e9ddc) and select and copy the code there (click the 'Raw' button to see only the code).
1. Output the book as a website.
1. Once the site has generated, open the chapter you need the nav YAML for. You may need to manually enter its URL in your browser to see it, if it's not yet in your navigation.
1. Right-click the page and choose 'Inspect'.
1. In the inspector window, open the 'Console' tab.
1. Paste in the code you copied from the gist, and hit enter.
1. Your YAML will appear there. Copy and paste it into a text file.

The gist includes comments that are instructions, including how to limit which heading levels to add to your YAML.
