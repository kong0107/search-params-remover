"use strict";

$("#saveButton").disabled = true;

getData({targets: ""})
.then(storage => $("#targets").value = storage.targets);

$("#targets").addEventListener("input", () => {
    $("#saveButton").disabled = false;
});

$("#saveButton").addEventListener("click", () => {
    $("#targets").disabled = true;
    $("#saveButton").disabled = true;
    setData({targets: $("#targets").value})
    .then(() => {
        $("#targets").disabled = false;
        proxy.runtime.sendMessage("targetListUpdated");
    });
});
