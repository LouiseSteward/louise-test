---
title: "Mathematics"
categories: editing
---

# Mathematics

This page is about how to create maths using LaTeX and MathJax. For stylistic issues, see [House style](house-style.html).

We're using LaTeX syntax for maths. The LaTeX is turned into displayed maths by [MathJax](http://docs.mathjax.org/en/latest/index.html). Surround your LaTeX with `$$` to have MathJax process it.

### MathJax in HTML blocks

Sometimes we have to use actual HTML code in our markdown, for instance when adding an HTML table to a figure. In that case, we surround LaTeX with `$$` … `$$` for displayed maths (centered, with blank space above and below), and `\(` … `\)` for inline maths.

### Avoid using LaTeX for content layout

LaTeX syntax can store two different kinds of info:

1. mathematics, delimited in our markdown with `$$`
2. content layout, which we must not use here.

MathJax can only display the mathematics, and does not understand content layout. (More detail [here](http://docs.mathjax.org/en/latest/tex.html).)

So in the first Leibniz, manuscript, we have this LaTeX:

```
\renewcommand*{\arraystretch}{1.5}
\begin{tabular}{l l}
$y=f(x)$ & function of one variable, where $x$ is the argument and $y$ is the output \\
$\dfrac{dy}{dx}$ & first derivative of $f(x)$ \\
$f'( x)$ & alternative notation for the first derivative of $f(x)$ \\
$\dfrac{d^2 y}{dx^2}$ & second derivative of $f(x)$ \\
$f''( x)$ & alternative notation for the second derivative of $f(x)$
\end{tabular}
```

If you paste that into [this online converter](https://www.latex4technics.com/) you'll see that the LaTeX (top window) displays fine, but the MathJax window shows an error.

This is because that notation includes both maths and layout stuff -- MathJax can't handle the layout stuff.

You have to learn to tell one from the other and fix the notation manually. In this case, and hopefully in all cases, that's actually quite easy, once you see what the author intended, by using that online converter or the image pasted into the Leibnez MS Word source file.

In this case, the author wants a table, with the first column containing math expressions, and the second column containing an explanation of each expression. So we need to manually change this LaTeX to a markdown table with inline maths. This means two things:

1. Replace the LaTeX table layout stuff with equivalent markdown.
2. Change the single `$` delimiters around the LaTeX math to doubles `$$`.

([Here's a quick guide to kramdown-markdown tables.](http://electricbook.works/guide/text/03-markdown.html#simple-tables))

Once we do that, the markdown, with inline math, looks like this:

```
| $$y=f(x)$$ | function of one variable, where $$x$$ is the argument and $$y$$ is the output
| $$\dfrac{dy}{dx}$$ | first derivative of $$f(x)$$
| $$f'( x)$$ | alternative notation for the first derivative of $$f(x)$$
| $$\dfrac{d^2 y}{dx^2}$$ | second derivative of $$f(x)$$
$$f''( x)$$ | alternative notation for the second derivative of $$f(x)$$
```

## Technical

To enable LaTeX syntax for maths:

1. Set `mathjax-enabled: true` in `_config.yml`. It is off (`false`) by default to avoid loading unnecessary scripts in books without maths.
2. For PDF output, you must have [PhantomJS](http://phantomjs.org/) installed. (PhantomJS must render the maths before Prince can include it in PDF output.)

The LaTeX is turned into displayed maths by [MathJax](http://docs.mathjax.org/en/latest/index.html). Surround your LaTeX with `$$` … `$$` to have MathJax process it.
