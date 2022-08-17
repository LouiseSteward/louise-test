---
title: "Questions"
categories: editing
---

# Multiple-choice questions

Questions are stored in their own files, and added to the body text with an `include` tag:

{% raw %}
`{% include question file="question-03-04" %}`
{% endraw %}

The question file should have this layout:

```
---
correct: 2
---

### **Question 3.4** Choose the correct answer(s)

[Figure 3.6](03.html#figure-3-6){:.show-page-number} shows Alexei’s indifference curves for free time and final grade. Which of the following is true?

- Alexei prefers C to B because at C he has more free time.
+ Alexei is indifferent between the grade of 84 with 15 hours of free time, and the grade of 50 with 20 hours of free time.
- Alexei prefers D to C, because at D he has the same grade and more free time.
- At G, Alexei is willing to give up 2 hours of free time for 10 extra grade points. 
{:.mcq-options}

* The indifference curve through C is lower than that through B. Hence Alexei prefers B to C.
* A, where Alexei has the grade of 84 and 15 hours of free time, and D, where Alexei has the grade of 50 with 20 hours of free time, are on
the same indifference curve.
* At D Alexei has the same amount of free time but a higher grade.
* The opposite trade-off is true: going from G to D, Alexei is willing to give up 10 grade points for 2 extra hours of free time. Going from G to E, he is willing to give up 2 hours of free time for 15 extra grade points.  
{:.mcq-feedback}
```

If there is more than one correct answer, then the file frontmatter might read:

```
---
correct: 2, 4
---
```

Note:

* The list of answer options has the class `.mcq-options`.
* The list of feedback, in order to relate the the answer options, has the class `.mcq-feedback`.
* If you have a regular list, too, immediately before one of these lists, separate it with a `^`, which is a [kramdown end-of-block marker](https://kramdown.gettalong.org/syntax.html#eob-marker). It tells kramdown the two lists above and below it are not one list.
