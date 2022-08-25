/**
 * Remove "?" and/or "#" if there is no `search` and `hash` respectively.
 *
 * If there is only the preceding character of `search` or `hash`,
 * the corresponding property may have empty string
 * and the character would be detected only in `href`.
 *
 * Though `search` would not contain "#",
 * it is legal for `hash` to have "?"
 * Therefore detecting "?" for empty `search` shall be careful;
 * otherwise `/path#aaa?bbb` would be changed unexpectedly.
 *
 * Examples:
 * * "/?#" => "/"
 * * "/?a#b" => unchanged
 * * "/?#?" => "/#?"
 */
const url = new URL(location);
let href = url.href;

if(href.includes("#") && url.hash.length <= 1)
    href = href.replace("#", "");
if(href.includes("?") && url.search.length <= 1) {
    if(!href.includes("#")
        || href.indexOf("#") > href.indexOf("?")
    ) href = href.replace("?", "");
}
if(href !== url.href)
    history.replaceState(null, "", href);


/**
 * Removing search params in hash.
 *
 * This is reported in Firefox add-ons website:
 * https://addons.mozilla.org/zh-TW/firefox/addon/search-params-remover/reviews/1524413/
 *
 * Parsing `hash` by `URLSearchParams` is not a good idea
 * because "a=3&b&a=4" and "a=3&a=4&b=" would be hard to distinguish.
 * Therefore RegExp is used here.
 *
 * Examples:
 * * "#fbclid=a" => ""
 * * "#fbclid&a" => "#a"
 * * "#a&fbclid" => "#a"
 * * "#fbclid&a&fbclid" => "#a"
 */
if(url.hash.length > 1) {
    chrome.storage.local.get({removeParams: []})
    .then(({removeParams}) => {
        let newHash = url.hash;
        removeParams.forEach(param => {
            const regexp = new RegExp(`${param}(=[^&]*)?`, "d");
            let match;
            while(match = regexp.exec(newHash)) {
                // Remove one of the preceding and following "&" character, even both existing.
                let [start, end] = match.indices[0];
                if(newHash.charAt(start - 1) === "&") --start;
                else if(newHash.charAt(end) === "&") ++end;
                newHash = newHash.substring(0, start) + newHash.substring(end);
            };
        });

        href = href.substring(0, href.indexOf("#")); // without "#" character
        if(newHash.length > 1) href += newHash;

        if(href != location.href) history.replaceState(null, "", href);
    });
}
