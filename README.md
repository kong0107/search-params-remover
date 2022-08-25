# search-params-remover
a browser extension helps you surf without fbclid, [UTM parameters](https://en.wikipedia.org/wiki/UTM_parameters), and parameters you specify.

## Versions
`v0.2.x` is based for Chrome-based browsers such as Microsoft Edge.
Firefox users may install [v0.1](https://github.com/kong0107/search-params-remover/releases/tag/v0.1) instead (due to manifest version issue).

## development notes

* I suggest only reloading rules by listening to `StorageArea.onChanged`;
  otherwise codes would be confusing.
* Firefox has not decided how to do with Manifest V3.
* [declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/) seems not having ways for `hash` to do things such as what `QueryTransform` does;
  and a question mark is still remained in `href` even though all params are removed and `search` is empty.
  These issues are handled in `content.js`.
  (`regexSubstitution` may work but I don't wanna try yet.)
