// ===== photos.js: photo preview and "new or old photo" check =====

// Show the chosen image inside an <img> tag before uploading
function previewImage(file, imgElement) {
  imgElement.src = URL.createObjectURL(file);
  imgElement.classList.remove("hidden");
}

// A file remembers when it was last changed. A photo taken today is "new".
// Note: this is a simple check. Phase 3 will also check on the server.
function checkPhotoAge(file) {
  const hours = (Date.now() - file.lastModified) / (1000 * 60 * 60);
  return hours <= 24 ? "New photo" : "Old photo";
}
