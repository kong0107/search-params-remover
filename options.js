const btnSave = document.getElementById("saveButton");
const ta = document.getElementById("targets");

btnSave.disabled = true;

chrome.storage.local.get({targets: ""})
.then(storage => ta.value = storage.targets);

ta.addEventListener("input", () => {
    btnSave.disabled = false;
    btnSave.textContent = "Save";
});

btnSave.addEventListener("click", () => {
    ta.disabled = true;
    btnSave.disabled = true;
    btnSave.textContent = "Saving...";
    const targets = ta.value.trim().split("\n").map(s => s.trim()).join("\n");
    ta.value = targets;
    chrome.storage.local.set({targets})
    .then(() => {
        ta.disabled = false;
        btnSave.textContent = "Saved";
    });
});
