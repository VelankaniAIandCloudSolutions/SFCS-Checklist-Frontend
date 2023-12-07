<template>
  <div class="container">
    <h1 class="text-center mb-4">
      <i class="fas fa-file-upload mr-2"></i>
      Upload the BOM
    </h1>

    <!-- Form Section -->
    <section class="card p-3 mb-4">
      <!-- Row 1: Product Name & Product Code -->
      <div class="row mb-3">
        <!-- Product Name -->
        <div class="col-md-6">
          <label for="productName" class="form-label">Product Name</label>
          <input
            type="text"
            class="form-control"
            id="productName"
            v-model="productName"
            required
          />
        </div>
        <!-- Product Code -->
        <div class="col-md-6">
          <label for="productCode" class="form-label">Product Code</label>
          <input
            type="text"
            class="form-control"
            id="productCode"
            v-model="productCode"
            required
          />
        </div>
      </div>

      <!-- Row 2: BOM Type & BOM REV No -->
      <div class="row mb-3">
        <!-- BOM Type -->
        <div class="col-md-6">
          <label for="bomType" class="form-label">BOM Type</label>
          <input
            type="text"
            class="form-control"
            id="bomType"
            v-model="bomType"
            required
          />
        </div>
        <!-- BOM REV No -->
        <div class="col-md-6">
          <label for="bomRevNo" class="form-label">BOM REV No</label>
          <input
            type="text"
            class="form-control"
            id="bomRevNo"
            v-model="bomRevNo"
            required
          />
        </div>
      </div>

      <!-- Row 3: Issue Date & Product Rev No -->
      <div class="row mb-3">
        <!-- Issue Date -->
        <div class="col-md-6">
          <label for="issueDate" class="form-label">Issue Date</label>
          <input
            type="date"
            class="form-control"
            id="issueDate"
            v-model="issueDate"
            required
          />
        </div>
        <!-- Product Rev No -->
        <div class="col-md-6">
          <label for="productRevNo" class="form-label">Product Rev No</label>
          <input
            type="text"
            class="form-control"
            id="productRevNo"
            v-model="productRevNo"
            required
          />
        </div>
      </div>
    </section>

    <!-- File Input for Excel -->
    <div class="card p-3 mb-4">
      <label for="fileInput" class="form-label">
        <i class="fas fa-cloud-upload-alt mr-2"></i>
        Choose BOM Excel file
      </label>
      <div class="custom-file">
        <input
          type="file"
          class="custom-file-input"
          id="fileInput"
          @change="handleFileUpload"
          accept=".xls, .xlsx"
          required
        />
        <label class="custom-file-label" for="fileInput">{{
          uploadedFileName || "Select file"
        }}</label>
      </div>
    </div>

    <!-- Upload Button -->
    <div class="card p-3">
      <button type="button" class="btn btn-primary" @click="submitForm">
        Upload BOM
      </button>
    </div>

    <!-- Uploaded Data Section (Same as before) -->
    <!-- <div class="card p-3"> -->
    <!-- File input for multiple files -->
    <!-- ... (same as before) ... -->
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      productName: "",
      productCode: "",
      bomType: "",
      bomRevNo: "",
      issueDate: "",
      productRevNo: "",
      uploadedFileName: null,
      uploadedFile: null,
    };
  },
  methods: {
    submitForm() {
      // Handle form submission
      console.log("Form submitted:", {
        productName: this.productName,
        productCode: this.productCode,
        bomType: this.bomType,
        bomRevNo: this.bomRevNo,
        issueDate: this.issueDate,
        uploadedFileName: this.uploadedFileName,
        uploadedFile: this.uploadedFile,
      });
      // Reset form fields after submission if needed
      this.productName = "";
      this.productCode = "";
      this.bomType = "";
      this.bomRevNo = "";
      this.issueDate = "";
      this.productRevNo = "";
      this.uploadedFileName = null;
      this.uploadedFile = null;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];

      if (file) {
        console.log("Uploaded file:", file);
        this.uploadedFileName = file.name;
        this.uploadedFile = file; // Store the file directly, no need to read content
      }
    },
    // readExcelFile(file) {
    //   const reader = new FileReader();

    //   reader.onload = (e) => {
    //     const data = e.target.result;
    //     // Assuming you have a function to parse Excel data
    //     const parsedData = this.parseExcelData(data);
    //     this.uploadedData = parsedData;
    //   };

    //   reader.onerror = (error) => {
    //     console.error(error);
    //   };

    //   reader.readAsBinaryString(file);
    // },
    // parseExcelData(data) {
    //   // Implement your logic to parse Excel data here
    //   // This is a simple example, you might need a library like XLSX or exceljs
    //   // to handle Excel parsing in a real-world scenario
    //   console.log("Parsing Excel data:", data);
    //   return [];
    // },
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
