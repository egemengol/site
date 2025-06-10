function debounce(func, wait) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

// Taken from mdbook
// The strategy is as follows:
// First, assign a value to each word in the document:
//  Words that correspond to search terms (stemmer aware): 40
//  Normal words: 2
//  First word in a sentence: 8
// Then use a sliding window with a constant number of words and count the
// sum of the values of the words within the window. Then use the window that got the
// maximum sum. If there are multiple maximas, then get the last one.
// Enclose the terms in <b>.
function makeTeaser(body, terms) {
  var TERM_WEIGHT = 40;
  var NORMAL_WORD_WEIGHT = 2;
  var FIRST_WORD_WEIGHT = 8;
  var TEASER_MAX_WORDS = 30;

  var stemmedTerms = terms.map(function (w) {
    return elasticlunr.stemmer(w.toLowerCase());
  });
  var termFound = false;
  var index = 0;
  var weighted = []; // contains elements of ["word", weight, index_in_document]

  // split in sentences, then words
  var sentences = body.toLowerCase().split(". ");

  for (var i in sentences) {
    var words = sentences[i].split(" ");
    var value = FIRST_WORD_WEIGHT;

    for (var j in words) {
      var word = words[j];

      if (word.length > 0) {
        for (var k in stemmedTerms) {
          if (elasticlunr.stemmer(word).startsWith(stemmedTerms[k])) {
            value = TERM_WEIGHT;
            termFound = true;
          }
        }
        weighted.push([word, value, index]);
        value = NORMAL_WORD_WEIGHT;
      }

      index += word.length;
      index += 1; // ' ' or '.' if last word in sentence
    }

    index += 1; // because we split at a two-char boundary '. '
  }

  if (weighted.length === 0) {
    return body;
  }

  var windowWeights = [];
  var windowSize = Math.min(weighted.length, TEASER_MAX_WORDS);
  // We add a window with all the weights first
  var curSum = 0;
  for (var i = 0; i < windowSize; i++) {
    curSum += weighted[i][1];
  }
  windowWeights.push(curSum);

  for (var i = 0; i < weighted.length - windowSize; i++) {
    curSum -= weighted[i][1];
    curSum += weighted[i + windowSize][1];
    windowWeights.push(curSum);
  }

  // If we didn't find the term, just pick the first window
  var maxSumIndex = 0;
  if (termFound) {
    var maxFound = 0;
    // backwards
    for (var i = windowWeights.length - 1; i >= 0; i--) {
      if (windowWeights[i] > maxFound) {
        maxFound = windowWeights[i];
        maxSumIndex = i;
      }
    }
  }

  var teaser = [];
  var startIndex = weighted[maxSumIndex][2];
  for (var i = maxSumIndex; i < maxSumIndex + windowSize; i++) {
    var word = weighted[i];
    if (startIndex < word[2]) {
      // missing text from index to start of `word`
      teaser.push(body.substring(startIndex, word[2]));
      startIndex = word[2];
    }

    // add <em/> around search terms
    if (word[1] === TERM_WEIGHT) {
      teaser.push("<strong>");
    }
    startIndex = word[2] + word[0].length;
    teaser.push(body.substring(word[2], startIndex));

    if (word[1] === TERM_WEIGHT) {
      teaser.push("</strong>");
    }
  }
  teaser.push("…");
  return teaser.join("");
}

function formatSearchResultItem(item, terms) {
  return (
    '<div class="search-results__item">' +
    `<a href="${item.ref}">${item.doc.title}</a>` +
    `<div>${makeTeaser(item.doc.body, terms)}</div>` +
    "</div>"
  );
}

// Got tired of the search index being eagerly loaded by any visitor,
// whether or not they actually used search. Seemed rude to those on
// narrow pipes. So, this routine sets up lazy loading of the search
// index when the user interacts with the search box.
function lazySearch() {
  // Variable for tracking execution of our callback and avoiding
  // multiple loading of the index.
  window.lazySearchLoadStarted = false;

  // Action to perform when we decide to activate search:
  var callback = function () {
    // first, ensure that this only completes once.
    if (!window.lazySearchLoadStarted) {
      // Build a <script> node referencing the search implementation.
      var script_code = document.createElement("script");
      script_code.type = "text/javascript";
      script_code.src = "/elasticlunr.min.js";

      // Do not set an event handler for when it's done,
      // as the two scripts will be loaded in DOM order.

      // Build a <script> node referencing the search index.
      var script_idx = document.createElement("script");
      script_idx.type = "text/javascript";
      script_idx.src = "/search_index.en.js";

      // Arrange to invoke the original, eager, initSearch
      // routine when it finishes loading.
      script_idx.onreadystatechange = initSearch;
      script_idx.onload = initSearch;

      // Now, sneak them into the <head>. This causes the browser
      // to load it once we return control to the event loop.
      // The order is significant.
      var head = document.getElementsByTagName("head")[0];
      head.appendChild(script_code);
      head.appendChild(script_idx);

      // Update the placeholder to show that something is happening.
      // TODO: this will require localization.
      var $searchInput = document.getElementById("search");
      $searchInput.placeholder = "Loading, please wait...";
      // Mark us as having executed.
      window.lazySearchLoadStarted = true;
    }
  };

  // Alright. Find the box.
  var $searchInput = document.getElementById("search");
  // Enable it since we've got Javascript
  $searchInput.disabled = false;
  // Is it already focused? This can happen if the user is fast and
  // the connection is slow.
  if (document.activeElement === $searchInput) {
    // Dang, they fast. Load it eagerly instead.
    callback();
  } else {
    // Arrange to load only when the box is focused.
    $searchInput.addEventListener("focus", callback);
  }
}

function initSearch() {
  var $searchInput = document.getElementById("search");
  var $searchResults = document.getElementById("search-results-main");

  $searchInput.placeholder = "🔎 Search";

  var $searchResultsItems = document.getElementById(
    "search-results-items-main",
  );
  var $content = document.querySelector(".content");
  var MAX_ITEMS = 10;

  var options = {
    bool: "AND",
    fields: {
      title: { boost: 2 },
      body: { boost: 1 },
    },
  };
  var currentTerm = "";
  var index = elasticlunr.Index.load(window.searchIndex);

  $searchInput.addEventListener(
    "input",
    debounce(function () {
      var term = $searchInput.value.trim();
      if (term === currentTerm || !index) {
        return;
      }
      currentTerm = term;
      $content.style.display = term === "" ? "block" : "none";
      $searchResults.style.display = term === "" ? "none" : "block";
      $searchResultsItems.innerHTML = "";
      if (term === "") {
        return;
      }

      var results = index.search(term, options);
      if (results.length === 0) {
        $searchResultsItems.innerHTML =
          "<p>No results found. (Only whole words longer than about 4 letters are indexed.)</p>";
        return;
      }

      for (var i = 0; i < Math.min(results.length, MAX_ITEMS); i++) {
        var item = document.createElement("li");
        item.innerHTML = formatSearchResultItem(results[i], term.split(" "));
        $searchResultsItems.appendChild(item);
      }
    }, 150),
  );
}

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  lazySearch();
} else {
  document.addEventListener("DOMContentLoaded", lazySearch);
}
