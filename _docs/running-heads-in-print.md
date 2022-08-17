---
title: "Running heads"
categories: layout
---

# Running heads

In the print edition, running heads are usually the text of the last second-level (`h2`) in the unit. For the opening pages where an `h2` hasn't appeared yet, the running head is the main unit heading (`h1`).

Sometimes a heading is too long to fit into the header area. We can then manually set the running-head text to use for that section. To do this, we add a `title`="" attribute to the heading:

```
## 11.1 How people changing prices to gain rents can lead to a market equilibrium
{:title="11.1 How changing prices can lead to a market equilibrium"}
```

Now that `title` text will be the running-head text.