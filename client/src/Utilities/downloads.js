

// If toJson is true, format the data into a human readable JSON
// format.
const download = (data, filename, toJson=false) => {
    let blob;
    if(toJson) {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    }
    else {
        blob = data;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

export { download };