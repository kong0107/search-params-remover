# search-params-remover
This is a browser extension helps you surf without fbclid, [UTM parameters](https://en.wikipedia.org/wiki/UTM_parameters), and parameters you specify.
Not only search params (with "?" preceding) is removed, but also substrings with format `key=value` in `hash` (with "#" preceding) would be removed.

## Examples (requirements)
* example.com/path?a=3&fbclid=xxx&b=4&b=5
  => `example.com/path?a=3&b=4&b=5`
* example.com/path#utm_term=condom&comments
  => `example.com/path#comments`
* example.com/path?fbclid=xxx#utm_term=condom
  => `example.com/path`

note: example.com is a valid website. After installing the extension, you can click the above links to check if the results fit.

## Versions
`v0.2.x` is based for Chrome-based browsers such as Microsoft Edge.
Firefox users may install [v0.1](https://github.com/kong0107/search-params-remover/releases/tag/v0.1) instead (due to manifest version issue), without modifying `hash` function.

## Development notes

* I suggest only reloading rules by listening to `StorageArea.onChanged`;
  otherwise codes would be confusing.
* Firefox has not decided how to do with Manifest V3.
* [declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/) seems not having ways for `hash` to do things such as what `QueryTransform` does;
  and a question mark is still remained in `href` even though all params are removed and `search` is empty.
  These issues are handled in `content.js`.
  (`regexSubstitution` may work but I don't wanna try yet.)
