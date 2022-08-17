{% comment %}
Fetch specific values from meta.yml and
add them to a Javascript object called metadata.
NB: The generated metadata load in client-side Javascript, so
do not include any values that should not be publicly available.
{% endcomment %}

// Create default metadata JS object
var metadata = {
    languages: ''
};

{% comment %} Generate an array of translation languages. {% endcomment %}
{% capture metadata-js-translation-languages %}
{% for work in site.data.meta.works %}
    {% for translation in work.translations %}
        '{{ translation.language }}'{% unless forloop.last %},{% endunless %}
    {% endfor %}
{% endfor %}
{% endcapture %}

// Add languages to the metadata object
metadata.languages = [{{ metadata-js-translation-languages | replace: " ", "" | strip_newlines }}];
