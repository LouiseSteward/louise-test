---
title: "Images"
categories: editing
---

# Images

*Also see [Figures](figures.html)*

## Creating images for CORE

Images intended to fill the main text column and retain their font sizes must be **1280px wide**, and **2160px wide** if they also fill the sidebar area.

If they must fill the full width of the page (e.g. chapter openers), they must be at least **2500px wide**.

Our current specs for creating images, especially charts:

* File type: Adobe Illustrator. Save `.ai` to `core/book/images/source`
* Artboard size: 110mm wide (use full artboard width, don't leave more than a fraction of white space left or right unless the art requires it or leaves no option; height can vary.)

[See the stylesheet in the repo here](https://github.com/fireandlion/core/blob/master/book/images/source/stylesheet.jpg).

Import styles from existing images to ensure consistency.

### Exporting to JPG

1. Make sure the artboards in the artboards panel are listed in the same order as the artboards themselves. Click and drag in the artboards panel to reorder the list. This does not affect the actual placement or order of artboards or artwork on them on the pasteboard.
2. Rename the artboards in the artboards panel as a, b, c, etc (i.e. the letter used for that image).
3. File > Export > Export as...
4. Choose JPG and tick 'Use artboards'. Leave range as 'All'.
5. Settings (mostly defaults):
   - Colour model CMYK
   - Quality 10 (max)
   - Compression baseline (standard)
   - Resolution 300dpi
   - Anti-aliasing: Type optimised (hinted)
   - Embed ICC profile: ticked (US Web Coated SWOP v2)
     Click Okay.
6. For multiple artboards:
   - Each artboard will land as a separate JPG, saved for e.g. as 'figure-01-01_a.jpg.` Note the underscore.
   - In Finder, select all the exported JPGs, right-click, and select 'Rename...'
   - The dialog lets you replace all underscores with hyphens.

    For single artboards: rename the file to remove the artboard indicator.

### Creating charts from Excel

1. Open `.xlsx` data, go to graph.
2. Right click, Export as image > eps
3. Place EPS in Adobe Illustrator.

## Adding image files

Our template comes with four folders for images, which correspond to output formats: `print-pdf`, `screen-pdf`, `web` and `epub`. Save your images files there. Each folder should contain the same set of images, saved appropriately for each format. For instance, while their file names must be identical, `web` images might be full-colour, 96dpi, and up to 800 pixels wide; while `print-pdf` images might be in greyscale, 300dpi and 2400 pixels wide.

### Automating image conversions

Technical users who run this project on your own machine can use the gulp script to automatically convert high-res, CMYK images in `print-pdf` to all the other formats.

You can automate the conversion of images to various outputs with [gulp](https://gulpjs.com/). You need to have npm installed, and to have run `npm install` in the project root to install the `node_modules`.

Then you only need to put high-res, CMYK versions of your images in `images/print-pdf` and run `gulp`. Our gulp script will automatically optimise, convert and save your images to the output folders, including specifying the correct colour profiles and creating multiple image sizes for web output.

If you're processing image files in a translation subdirectory, specify the language by its code. E.g.:

```
gulp --language fr
```


### Adding images in markdown

We use standard markdown to embed images:

~~~
![A description of the image](../{{ site.image-set }}/filename.svg)
~~~

Let's break that down:

* the exclamation mark and square and round brackets make up the masic markdown image syntax: `![Description](filename)`. The description is especially important for screen-readers used by the visually impaired.
* `../` means 'go up, out of the `text` folder'
* `{{ site.image-set }}/` means 'go into the folder containing our preferred set of images' (as defined in `_config.yml`). The default image-set folder is `images`.
* finally, the image file name.

### Images in translations

If you are creating a [translation](70-translations.html#translations) in a subdirectory of `text`, and your images are in the parent book folder, you need to change the path to the images slightly. You have two options:

1. Use the {% raw %}`{{ path-to-book-directory }}`{% endraw %} metadata tag. At the top of your markdown file, add {% raw %}`{% include metadata %}`{% endraw %}, so that you can use metadata variables in that file. Then instead of any `../`s, you use the tag: {% raw %}`{{ path-to-book-directory }}{{ site.image-set }}/filename.jpg`{% endraw %}.

   Even if you're not in a translation folder, it's good practice to always use the {% raw %}`{{ path-to-book-directory }}`{% endraw %} tag for maximum portability, if you don't mind having the {% raw %}`{% include metadata %}`{% endraw %} tag at the top of your files.

1. Add another `../` for each directory level. So if your translation text is in `book/text/fr`, you need to come up three levels before going into `book/images`. So your path is `../../{{ site.image-set }}/filename.jpg`.

### External media

If a large number of images makes your project too big, you can store your images in a separate repo and serve them on a separate server for PDF and web output.

#### Setting external-media paths

You set the full URL for the `remote-media` location in `_data/settings.yml`. For example:

```
remote-media:
  live: "http://media.example.com"
  development: "http://dev.example.com/media"
```

To disable external media, just comment out the relevant settings or leave the values blank:

```
remote-media:
  live: ""
  development: ""
```

#### Structuring external-media files

At the remote-media domain, the paths to media should match the paths to that media in this project.

For example, if a project called `example` contains two books, `foobar` and `helloworld`, the remote-media URL might be `http://media.example.com`. And on that media server, web images would be stored in `http://media.example.com/foobar/images/web` and `http://media.example.com/helloworld/images/web`.

Images inserted by CSS (e.g. `background-image` files) cannot be in external media, because their paths are fixed in CSS. So do not move these to the external media location.

#### Epub and app output

Note that remote-media does not work for app or epub output. For books with enough images to warrant remote-media, it's recommended that you use a separate repo for your app, and you won't have a sensibly sized epub anyway.

#### Translations

When using remote-media, translations must have their own image files in their translation subdirectories (e.g. `http://example.com/foobar/fr/images/web`); that is, unlike local images they cannot inherit their parent language's images.

#### Local media

Remote media works well for web output when you're online, but for faster PDF output you can tell the system to use images on your local machine instead.

You can set a `local-media` path, too, in addition to `remote-media`, like this (using example paths):

```
local-media:
  live: ""
  development: ""
```

(Currently, the `live` local media has no meaning, and only the `development` default is used; but this might change in future, for example the Electric Book Manager may use the `live` setting. So set both.)

When a `local-media` path is set, PDF outputs will use that local media, so that Prince does not have to fetch every image online. Web output generally cannot use a `local-media` path, because the webserver cannot see outside of its root directory on your file system.

The local-media path is set as a relative path on your computer, relative to the `_site` folder.

So we recommend that you store your local copy of the external-media directory alongside the main project repo directory, to make the path to it simple.

To use external media from a directory alongside the main project repo, then, you would write it to go up two levels (`../../`) and into the external media directory. E.g.:

```
local-media:
  development: "../../example-media"
```

Note: The `development` build is the default build type. A `live` build only really applies to web builds. The `build: live` config is set in `_config.live.yml`, which is generally only used for building live website packages.
{:.box}
