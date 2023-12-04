<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">
      <i class="fas fa-file-upload mr-2"></i>
      Upload the Bom
    </h1>

    <div class="card p-3">
      <!-- File input -->
      <div class="mb-3">
        <label for="fileInput" class="form-label">
          <i class="fas fa-cloud-upload-alt mr-2"></i>
          Choose an Excel file
        </label>
        <div class="custom-file">
          <input
            type="file"
            class="custom-file-input"
            id="fileInput"
            @change="handleFileUpload"
          />
          <label class="custom-file-label" for="fileInput">Select file</label>
        </div>
      </div>

      <!-- Display uploaded data -->
      <div v-if="uploadedData.length > 0">
        <h5 class="mt-3">Uploaded Data:</h5>
        <table class="table">
          <thead>
            <tr>
              <th
                scope="col"
                v-for="(value, key) in uploadedData[0]"
                :key="key"
              >
                {{ key }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in uploadedData" :key="index">
              <td v-for="(value, key) in row" :key="key">{{ value }}</td>
            </tr>
          </tbody>
        </table>
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
      const file = event.target.files[0];

      if (file) {
        this.readExcelFile(file);
      }
    },
    readExcelFile(file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        // Assuming you have a function to parse Excel data
        this.uploadedData = this.parseExcelData(data);
      };

      reader.readAsBinaryString(file);
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

<style>
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
