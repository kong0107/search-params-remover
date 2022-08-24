# search-params-remover
a browser extension helps you surf without fbclid, [UTM parameters](https://en.wikipedia.org/wiki/UTM_parameters), and parameters you specify.

## Versions
`v0.2.x` is based for Chrome-based browsers such as Microsoft Edge.
Firefox users may install [v0.1](https://github.com/kong0107/search-params-remover/releases/tag/v0.1) instead (due to manifest version issue).

## development notes

* While updating the params to be removed, write them to storage, and then the listener added to `StorageArea.onChanged` will reload redirect rules.
* Firefox has not decided how to do with Manifest V3.