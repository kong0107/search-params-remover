const btnSave = document.getElementById("saveButton");
const ta = document.getElementById("removeParams");

btnSave.disabled = true;

chrome.storage.local.get({removeParams: []})
.then(({removeParams}) => ta.value = removeParams.join("\n"));

ta.addEventListener("input", () => {
    btnSave.disabled = false;
    btnSave.textContent = "Save";
});

btnSave.addEventListener("click", () => {
    ta.disabled = true;
    btnSave.disabled = true;
    btnSave.textContent = "Saving...";
    const removeParams = ta.value.split("\n").filter(x => !!x).map(s => s.trim());
    ta.value = removeParams.join("\n");

    chrome.storage.local.set({removeParams})
    .then(() => {
        ta.disabled = false;
        btnSave.textContent = "Saved";
    });
});
