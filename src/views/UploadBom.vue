<template>
  <div class="container">
    <h1 class="text-center mb-4">
      <i class="fas fa-file-upload mr-2"></i>
      Upload the Bom
    </h1>

    <div class="card p-3">
      <!-- File input for multiple files -->
      <div class="mb-3">
        <label for="fileInput" class="form-label">
          <i class="fas fa-cloud-upload-alt mr-2"></i>
          Choose Excel files
        </label>
        <div class="custom-file">
          <input
            type="file"
            class="custom-file-input"
            id="fileInput"
            @change="handleFileUpload"
            multiple
          />
          <label class="custom-file-label" for="fileInput">Select files</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadedData: [],
    };
  },
  methods: {
    handleFileUpload(event) {
      const files = event.target.files;

      if (files.length > 0) {
        this.readExcelFiles(files);
      }
    },
    readExcelFiles(files) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        promises.push(this.readExcelFile(file));
      }

      Promise.all(promises)
        .then((results) => {
          // Combine results from all files
          this.uploadedData = results.flat();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    readExcelFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const data = e.target.result;
          // Assuming you have a function to parse Excel data
          const parsedData = this.parseExcelData(data);
          resolve(parsedData);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsBinaryString(file);
      });
    },
    parseExcelData(data) {
      // Implement your logic to parse Excel data here
      // This is a simple example, you might need a library like XLSX or exceljs
      // to handle Excel parsing in a real-world scenario
      console.log("Parsing Excel data:", data);
      return [];
    },
  },
};
</script>

<style scoped>
/* Custom styles */
body {
  font-family: "Quicksand", sans-serif;
}

.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-size: 18px;
  font-weight: bold;
}

.custom-file-input {
  cursor: pointer;
}

.table {
  margin-top: 20px;
}

.table th,
.table td {
  font-size: 16px;
}
</style>
