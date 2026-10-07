// ========================================
// CLOUD FILE STORAGE APPLICATION
// ========================================


// Maximum storage
const MAX_STORAGE = 100 * 1024 * 1024; // 100 MB


// Current storage
let usedStorage = 0;


// HTML elements
const fileInput = document.getElementById("fileInput");

const selectedFile =
    document.getElementById("selectedFile");

const uploadBtn =
    document.getElementById("uploadBtn");

const fileTable =
    document.getElementById("fileTable");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const progressBar =
    document.getElementById("progressBar");

const storageText =
    document.getElementById("storageText");


// ========================================
// FILE SELECTION
// ========================================

fileInput.addEventListener("change", function () {

    if (fileInput.files.length === 0) {

        selectedFile.textContent =
            "No file selected";

        return;
    }

    const file = fileInput.files[0];

    selectedFile.textContent =
        "Selected: " + file.name;

});


// ========================================
// UPLOAD FILE
// ========================================

uploadBtn.addEventListener("click", function () {

    if (fileInput.files.length === 0) {

        alert("Please select a file first.");

        return;
    }


    const file = fileInput.files[0];


    // Check storage
    if (usedStorage + file.size > MAX_STORAGE) {

        alert(
            "Not enough cloud storage available."
        );

        return;
    }


    // Add file size
    usedStorage += file.size;


    // Create table row
    const row = document.createElement("tr");


    // File name
    const nameCell =
        document.createElement("td");

    nameCell.textContent = file.name;


    // File type
    const typeCell =
        document.createElement("td");

    typeCell.textContent =
        getFileType(file.name);


    // File size
    const sizeCell =
        document.createElement("td");

    sizeCell.textContent =
        formatFileSize(file.size);


    // Date
    const dateCell =
        document.createElement("td");

    dateCell.textContent =
        new Date().toLocaleDateString();


    // Action cell
    const actionCell =
        document.createElement("td");


    // Download button
    const downloadButton =
        document.createElement("button");

    downloadButton.textContent =
        "Download";

    downloadButton.className =
        "action-btn download-btn";


    downloadButton.addEventListener(
        "click",
        function () {

            downloadFile(file);

        }
    );


    // Delete button
    const deleteButton =
        document.createElement("button");

    deleteButton.textContent =
        "Delete";

    deleteButton.className =
        "action-btn delete-btn";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteFile(
                row,
                file.size
            );

        }
    );


    // Add buttons
    actionCell.appendChild(
        downloadButton
    );

    actionCell.appendChild(
        deleteButton
    );


    // Add cells to row
    row.appendChild(nameCell);

    row.appendChild(typeCell);

    row.appendChild(sizeCell);

    row.appendChild(dateCell);

    row.appendChild(actionCell);


    // Add row to table
    fileTable.appendChild(row);


    // Hide empty message
    emptyMessage.style.display = "none";


    // Update storage
    updateStorage();


    // Reset input
    fileInput.value = "";

    selectedFile.textContent =
        "No file selected";


    alert(
        "File uploaded successfully!"
    );

});


// ========================================
// DELETE FILE
// ========================================

function deleteFile(row, fileSize) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this file?"
        );


    if (!confirmDelete) {

        return;
    }


    // Reduce storage
    usedStorage -= fileSize;


    // Remove row
    row.remove();


    // Update storage
    updateStorage();


    // Show empty message
    if (fileTable.children.length === 0) {

        emptyMessage.style.display = "block";

    }

}


// ========================================
// DOWNLOAD FILE
// ========================================

function downloadFile(file) {

    const url =
        URL.createObjectURL(file);


    const link =
        document.createElement("a");


    link.href = url;

    link.download = file.name;


    document.body.appendChild(link);

    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


// ========================================
// SEARCH FILES
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        const searchValue =
            searchInput.value.toLowerCase();


        const rows =
            fileTable.querySelectorAll("tr");


        rows.forEach(function (row) {

            const fileName =
                row
                    .children[0]
                    .textContent
                    .toLowerCase();


            if (
                fileName.includes(searchValue)
            ) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    }
);


// ========================================
// UPDATE STORAGE
// ========================================

function updateStorage() {

    const percentage =
        (usedStorage / MAX_STORAGE) * 100;


    progressBar.style.width =
        percentage + "%";


    storageText.textContent =
        formatFileSize(usedStorage)
        + " / 100 MB";


    // Change color when storage is high
    if (percentage >= 80) {

        progressBar.style.background =
            "#ef4444";

    } else if (percentage >= 50) {

        progressBar.style.background =
            "#f59e0b";

    } else {

        progressBar.style.background =
            "#2563eb";

    }

}


// ========================================
// FILE SIZE FORMAT
// ========================================

function formatFileSize(bytes) {

    if (bytes === 0) {

        return "0 Bytes";

    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const i =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        (bytes / Math.pow(1024, i))
            .toFixed(2)
        + " "
        + units[i]
    );

}


// ========================================
// FILE TYPE
// ========================================

function getFileType(fileName) {

    const extension =
        fileName
            .split(".")
            .pop()
            .toUpperCase();


    return extension || "Unknown";

}


// ========================================
// INITIALIZE
// ========================================

updateStorage();
