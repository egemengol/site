+++
title = "Part 2: Content Structure in Zola"
date = 2023-08-10
description = "Learn how to organize your content effectively with Zola's sections and taxonomies"
[taxonomies]
series = ["Zola Guide"]
tags = ["static site", "tutorial", "content management"]
+++

# Content Structure in Zola

In Part 1, we introduced Zola and set up a basic site. Now, let's dive into how content is organized in Zola and how to structure your site effectively.

## Understanding Zola's Content Model

Zola has a straightforward but powerful content organization system based around:

1. **Pages**: Individual pieces of content (like blog posts)
2. **Sections**: Collections of pages (like categories)
3. **Taxonomies**: Ways to classify content across sections (like tags)

This structure provides flexibility while maintaining an intuitive organization.

## Sections: The Building Blocks

Sections are defined by the directory structure in your `content` folder. Each directory becomes a section, and each Markdown file within it becomes a page.

For example:

```
content/
├── _index.md           # Site homepage content
├── blog/               # Blog section
│   ├── _index.md       # Blog landing page content
│   ├── first-post.md   # A blog post
│   └── second-post.md  # Another blog post
└── about.md            # A standalone page
```

The `_index.md` file is special - it defines the metadata and content for the section landing page.

### Section Configuration

A section's `_index.md` might look like this:

```md
+++
title = "Blog"
sort_by = "date"        # Sort posts by date
paginate_by = 5         # Show 5 posts per page
template = "blog.html"  # Use this template for the section
+++

Introduction text for your blog section goes here.
```

## Pages: The Content

Pages are created using Markdown files with TOML frontmatter. Here's a typical blog post:

```md
+++
title = "My First Post"
date = 2023-08-05
description = "This is my first blog post using Zola"
[taxonomies]
tags = ["rust", "zola"]
categories = ["tutorials"]
+++

Content of the post goes here...
```

## Taxonomies: Cross-Section Organization

Taxonomies allow you to categorize content across different sections. Common examples include tags, categories, and authors.

You define taxonomies in `config.toml`:

```toml
taxonomies = [
    {name = "tags", feed = true, paginate_by = 10},
    {name = "categories", feed = true},
    {name = "authors"}
]
```

Then, you can use them in your page frontmatter:

```md
+++
title = "Example Post"
[taxonomies]
tags = ["web", "zola"]
categories = ["tech"]
authors = ["Jane Smith"]
+++
```

### Creating Series with Taxonomies

For related content like tutorial series, you can create a `series` taxonomy:

```toml
taxonomies = [
    # Other taxonomies...
    {name = "series"}
]
```

Then tag your posts with the same series name:

```md
+++
title = "Part 1: Introduction"
[taxonomies]
series = ["Zola Guide"]
+++
```

## Asset Co-location

Zola supports keeping assets alongside your content. For example, if you have a post with images:

```
content/
└── blog/
    ├── my-post/
    │   ├── index.md     # The post content
    │   ├── image1.jpg   # Images used in the post
    │   └── image2.png
    └── another-post.md
```

In your Markdown, you can reference these images relatively:

```md
![Image description](image1.jpg)
```

## What's Next?

In Part 3 of this series, we'll explore Zola's templating system, learning how to create custom layouts using the Tera templating engine.

Stay tuned as we continue building our Zola site!