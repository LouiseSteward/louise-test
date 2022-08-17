---
title: "Dialogue"
categories: editing
---

# Dialogue

You can create a playscript-like dialogue layout like this:

```
Accountant
: The cost of concert A is your “out-of-pocket” cost: you paid $25 for a ticket, so the cost is $25.

Economist
: But what do you have to give up to go to concert A? You give up $25, plus the enjoyment of the free concert in the park. So the cost of concert A for you is the out of pocket cost plus the opportunity cost.
{:.dialogue}
```

This comprises:

- the markdown syntax for a [definition list](https://kramdown.gettalong.org/syntax.html#definition-lists)
- a `{:.dialogue}` tag. Add it to the line immediately following the last piece of dialogue.

This gives us this layout:

![image](https://cloud.githubusercontent.com/assets/1053331/26732449/f3457582-47b7-11e7-945a-f8069773ab2d.png)
