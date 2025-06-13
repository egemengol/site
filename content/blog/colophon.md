+++
title = "Colophon"
date = 2025-06-14
description = "This site is designed for a fast, private, and enjoyable reading experience. It does not use cookies or tracking, and JavaScript isn't needed. Inspired by making the web better for everyone."
[taxonomies]
tags = ["blog", "static-site", "optimization"]
+++

Huge credit to [Cliffle - Making my website faster](https://cliffle.com/blog/making-website-faster/).

I've put a lot of thought and care to make this blog to be both fast and comfortable for you, while being flexible and fun to work with for me. 

This blog does not use cookies and do not track you. Works without needing JS, but uses it consciously to enhance itself. Does not make any third-party cross-domain requests.

Its code is open-sourced [on GitHub](https://github.com/egemengol/site).

## The Stack

[Zola](https://www.getzola.org/). This simple and flexible static site generator, provides all the features I wanted out of the box, with a perfect amount of decisions pre-made for me. Supports RSS, Atom and `sitemap.xml`.

Sass made writing compartmentalized styling documents easy while keeping them performant.

Served via nginx, with certbot for HTTPS, on a Hetzner VPS.

## The Tricks

-   **Critical CSS & Asset Loading Strategy**: Styles are split, embedding **critical CSS** directly in the `<head>` for an instant, mostly-formed appearance, reducing layout shifts. Other assets like stylesheets, scripts, images, and fonts are **preloaded asynchronously** once it's known they'll be used.
-   **Optimized & Self-Hosted Assets**: Images (like PNGs) are scaled down using Zola's `resize_image` where appropriate. Fonts are converted from `.ttf` to compressed `.woff2` format. All assets, including home-brewed styling, are **self-hosted** with no JS dependencies or CDN reliance.
-   **Server & Build-Time Compression**: `nginx` handles **server-side compression** for relevant filetypes (like HTML, CSS, JS, SVG, XML). Zola's built-in **HTML minification** strips unnecessary characters (like comments and whitespace) from the output.
-   **Efficient & User-Friendly Search**: The search index **lazy-loads** only when the search box is selected. Input is **debounced** to improve responsiveness, and results feature helpful, **highlighted snippets** from page content. This approach is directly copied from [Cliffle](https://cliffle.com/blog/making-website-faster/)'s implementation.
-   **Smart Theme Switching**: Theme selection uses **vanilla JS** and `localStorage`, defaulting to browser preference. Theme icons are **lazy-loaded** when needed, and the active icon is set in the `<head>` to prevent flickering during theme changes.

## The Verdict

The result is a fast, privacy-respecting blog that's enjoyable to read and maintain. Striving for a balance of modern features and lightweight performance, this site aims to be a pleasant corner of the web.
