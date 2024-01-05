const dropbox = document.querySelector('.dropbox');
const message = document.querySelector('.message');
const fileInput = document.getElementById('fileInput');

dropbox.addEventListener('dragover', (e) => {
  e.preventDefault();
});

dropbox.addEventListener('drop', (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  handleFiles(files);
  // Trigger file input programmatically
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  // Submit the form when a file is selected
  handleFiles(fileInput.files);
});

function handleFiles(files) {
  if (!files || files.length === 0) {
    message.textContent = 'No files selected.';
    return;
  }

  const fileNames = Array.from(files).map(file => file.name);
  message.textContent = `Dropped files: ${fileNames.join(', ')}`;

  // Send file information to server
  const formData = new FormData();
  Array.from(files).forEach(file => {
    formData.append('file', file);
  });

  fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // You can handle the response from the server as needed
    })
    .catch((error) => {
      console.error('Error uploading files:', error);
    });
}
