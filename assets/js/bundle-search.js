---
layout: null
---

{% unless site.output == "web" and site.data.settings.search-type == "google-cse" %}

{% include metadata %}

{% include_relative vendor/elasticlunr.min.js %}
{% include_relative search-data.js %}
{% include_relative search.min.js %}

{% endunless %}
