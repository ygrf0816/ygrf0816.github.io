---
layout: page
title: Tech
permalink: /Tech/
---

{% for post in site.categories.Tech %}
   [{{ post.title }}]({{ post.url }})
  *发表于 {{ post.date | date: "%Y-%m-%d" }}*
{% endfor %}