+++
title = "Part 1: Introduction to Building with Zola"
date = 2023-08-01
description = "An introduction to Zola and why it's a great choice for static sites"
[taxonomies]
series = ["Zola Guide"]
tags = ["static site", "tutorial", "web development"]
+++

# Introduction to Building with Zola

Zola is a powerful static site generator (SSG) written in Rust. It emphasizes simplicity, speed, and flexibility—making it an excellent choice for blogs, documentation sites, and portfolios.

## Why Choose Zola?

Unlike other static site generators that require plugins or extensions for basic functionality, Zola comes with everything you need built-in:

- **Lightning Fast**: Built in Rust, Zola generates sites in milliseconds
- **Zero Dependencies**: No Node.js, Ruby, or Python required
- **Built-in Sass Compilation**: Write your CSS with Sass out of the box
- **Powerful Templating**: Uses the Tera templating engine (similar to Jinja2/Liquid)
- **Search Included**: Built-in search index generation
- **Syntax Highlighting**: Code highlighting without JavaScript
- **Shortcodes**: Create reusable content components

## Getting Started

Installing Zola is straightforward. You can download pre-built binaries from the [official releases page](https://github.com/getzola/zola/releases) or install it using package managers:

### macOS
```bash
brew install zola
```

### Linux
```bash
snap install --edge zola
```

### Windows
```bash
scoop install zola
```

## Creating Your First Zola Site

Once installed, creating a new site is as simple as:

```bash
zola init my-awesome-site
cd my-awesome-site
zola serve
```

This creates a new site with a default structure and starts a local development server at `http://127.0.0.1:1111`.

## Basic Site Structure

A typical Zola site includes:

- `content/`: Where your Markdown files live
- `templates/`: Tera templates for rendering content
- `static/`: Static assets like images, CSS, and JavaScript
- `sass/`: (Optional) Sass files for styling
- `config.toml`: Site configuration

## What's Next?

In Part 2 of this series, we'll dive deeper into Zola's content organization, exploring how to structure your site effectively with sections and taxonomies.

Stay tuned for more as we explore how to build a complete website with Zola!