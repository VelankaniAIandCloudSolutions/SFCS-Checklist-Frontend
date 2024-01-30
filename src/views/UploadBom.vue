<template>
  <div v-if="$store.state.isLoading" class="container text-center">
    <div
      class="spinner-border mt-5"
      style="width: 4rem; height: 4rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div>
      <b> Loading... </b>
    </div>
  </div>
  <div v-else class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->

      <div class="d-flex align-items-center mt-4">
        <h2 class="mb-0">Upload Bill Of Materials</h2>
        <span class="ms-3 fs-4 text-muted">|</span>
        <nav aria-label="breadcrumb" class="d-inline-block ms-3">
          <ol class="breadcrumb bg-transparent m-0 p-0">
            <li class="breadcrumb-item">
              <a href="/"><i class="fas fa-home me-1"></i>Home</a>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/bom">
                <i class="fas fa-clipboard-list me-1"></i>
                Bill Of Materials
              </router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              <i class="fas fa-upload me-1"></i>
              Upload the bom
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Form Section -->
    <section class="card p-3 mb-4 mt-4">
      <!-- Row 1: Project Name & Product  -->
      <div class="row mb-3">
        <!-- Project Name -->
        <div class="col-md-6">
          <label for="projectDropdown" class="form-label">Select Project</label>

          <select
            class="form-select"
            id="projectDropdown"
            v-model="selectedProject"
            @change="loadProducts"
            required
          >
            <!-- <option value="" disabled>Select a project</option> -->
            <option
              v-for="project in projects"
              :key="project.id"
              :value="project.id"
            >
              {{ project.name }}
            </option>
          </select>
        </div>
        <!-- Product Code -->
        <div class="col-md-6">
          <label for="productCode" class="form-label">Product </label>
          <select
            class="form-select"
            id="productCode"
            v-model="selectedProduct"
            required
          >
            <option
              v-for="product in filteredProducts"
              :key="product.id"
              :value="product.id"
            >
              {{ product.name }}
            </option>
          </select>
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
            @input="validateBomRevNo"
            required
          />
          <p v-if="bomRevNo !== '' && !isValidBomRevNo" class="text-danger">
            BOM REV No should be a decimal type with a minimum of 1.0.
          </p>
        </div>
      </div>

      <!-- Row 3: Issue Date & Product Rev No -->
      <div class="row mb-3 justify-content-center">
        <!-- Issue Date -->
        <!-- <div class="col-md-6">
          <label for="batchQuantity" class="form-label">
            <i class="fas fa-flask me-2"></i>Batch Quantity
          </label>
          <input
            v-model="batchQuantity"
            type="number"
            class="form-control"
            placeholder="Enter Batch Quantity"
            min="1"
            required
          />
        </div> -->

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
        <!-- <div class="col-md-6">
          <label for="productRevNo" class="form-label">Product Rev No</label>
          <input
            type="text"
            class="form-control"
            id="productRevNo"
            v-model="productRevNo"
            required
          />
        </div> -->
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

    <!-- change note modal -->

    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- BOM Revision Inspect Modal -->
    <div
      class="modal fade"
      id="BomRevModal"
      tabindex="-1"
      aria-labelledby="BomRevModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="BomRevModalLabel">
              Comments For Revision
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <textarea
              v-model="bom_rev_change_note"
              class="form-control"
              rows="4"
              placeholder="Please enter the reason for change..."
            ></textarea>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="saveChanges"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#BomRevModal"
    >
      Launch demo modal
    </button>

    <!-- Uploaded Data Section (Same as before) -->
    <!-- <div class="card p-3"> -->
    <!-- File input for multiple files -->
    <!-- ... (same as before) ... -->
    <!-- </div> -->
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      productName: "",
      productCode: "",
      bomType: "",
      bomRevNo: "",
      isValidBomRevNo: true,
      issueDate: "",
      // order: {
      //   selectedBomId: null,
      //   batchQuantity: 1,
      // },
      batchQuantity: 1,
      productRevNo: "",
      uploadedFileName: null,
      uploadedFile: null,
      selectedProject: null, // Holds the selected project ID
      selectedProduct: null,
      projects: [],
      products: [],
      bom_rev_change_note: "",
    };
  },
  computed: {
    filteredProducts() {
      // Check if both products and projects are available and not undefined
      if (
        this.products &&
        this.projects &&
        this.products.length &&
        this.projects.length
      ) {
        // Filter products based on the selected project if it's not null
        console.log("selectedProject", this.selectedProject);
        if (this.selectedProject !== null) {
          const filteredProducts = this.products.filter((product) => {
            // Access the project ID directly from the product
            const projectId = product.project;

            // Check if the project ID matches the selected project
            return projectId === this.selectedProject;
          });

          console.log("Filtered Products:", filteredProducts);

          return filteredProducts;
        } else {
          // If selectedProject is null, return all products or an empty array
          console.log("All Products:", this.products);
          return [];

          // Or return [] if you want an empty array when selectedProject is null
          // return [];
        }
      } else {
        // If either products or projects is not available, return an empty array
        console.log("No Products or Projects available.");
        return [];
      }
    },
  },

  mounted() {
    this.getData();
  },

  methods: {
    validateBomRevNo() {
      const bomRevNoRegex = /^(1\.[0-9]|1[0-9]|2\.0)$/;

      if (bomRevNoRegex.test(this.bomRevNo)) {
        this.isValidBomRevNo = true;
      } else {
        this.isValidBomRevNo = false;
      }
    },
    async getData() {
      try {
        // Replace 'store/get-projects/' with your actual API endpoint
        const response = await axios.get("store/create-order/");
        console.log(response.data);
        this.projects = response.data.projects;
        // Assuming the response is an array of projects
        this.projects = response.data.projects;
        this.products = response.data.products;
        console.log(this.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },

    async submitForm() {
      this.$store.commit("setIsLoading", true);
      const formData = new FormData();
      console.log("Form Data:", {
        selectedProjectId: this.selectedProject,
        selectedProductName: this.selectedProduct,
        bomType: this.bomType,
        bom_rev_no: this.bomRevNo,
        issueDate: this.issueDate,
        uploadedFileName: this.uploadedFileName,
        bom_rev_change_note: this.bom_rev_change_note,
        // batchQuantity: this.batchQuantity,
      });

      formData.append("project_id", this.selectedProject);
      formData.append("product_id", this.selectedProduct);
      // formData.append("product_name", this.productName);
      // formData.append("product_code", this.productCode);
      // formData.append("product_rev_no", this.productRevNo);
      formData.append("bom_type", this.bomType);
      formData.append("bom_rev_no", this.bomRevNo);
      formData.append("issue_date", this.issueDate);
      // formData.append("batch_quantity", this.batchQuantity);
      formData.append("bom_file", this.uploadedFile);
      // formData.append("bom_rev_change_note", this.bom_rev_change_note);

      // console.log("Form Data:", formData);

      try {
        const responseCases = await axios.post(
          "store/handle-bom-cases/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(
          "Response from handle-bom-cases API:",
          responseCases.data
        );
        if (responseCases.status === 200) {
          // Case 1: BOM already exists
          this.$store.commit("setIsLoading", true);
          console.log(responseCases.data.message);
          this.$notify({
            title: "BOM Already Exists With Rev No",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.$store.commit("setIsLoading", false);
        } else if (responseCases.status === 201) {
          // Case 2: New BOM revision number for an existing product
          this.$store.commit("setIsLoading", true);
          console.log(responseCases.data.message);
          // Trigger modal here

          this.$bvModal.show("BomRevModal");
          const responseUploadBOM = await axios.post(
            "store/upload-bom/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log(responseUploadBOM.data);
          const task_id = responseUploadBOM.data.task_id;
          if (
            responseUploadBOM.data.task_status === "IN PROGRESS" ||
            responseUploadBOM.data.task_status === "PENDING"
          ) {
            setTimeout(() => {
              this.checkTaskStatus(task_id);
            }, 10000);
          } else if (responseUploadBOM.data.task_status === "SUCCESS") {
            this.$notify({
              title: "BOM Uploaded Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
            this.$router.push("/bom");
          } else {
            this.$notify({
              title: "BOM Upload Failed",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          }

          // Replace 'your-modal-id' with the actual ID of your modal
        } else if (responseCases.status === 404) {
          this.$store.commit("setIsLoading", true);
          console.log(responseCases.data.message);
          const responseUploadBOM = await axios.post(
            "store/upload-bom/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log(responseUploadBOM.data);
          const task_id = responseUploadBOM.data.task_id;
          if (
            responseUploadBOM.data.task_status === "IN PROGRESS" ||
            responseUploadBOM.data.task_status === "PENDING"
          ) {
            setTimeout(() => {
              this.checkTaskStatus(task_id);
            }, 10000);
          } else if (responseUploadBOM.data.task_status === "SUCCESS") {
            this.$notify({
              title: "BOM Uploaded Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
            this.$router.push("/bom");
          } else {
            this.$notify({
              title: "BOM Upload Failed",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          }
        }
      } catch (error) {
        console.log("error:", error);
        this.$notify({
          title: "An error occurred, please try again later",
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },
    async checkTaskStatus(taskId) {
      try {
        const response = await axios.get(`store/check-task-status/${taskId}/`);
        if (
          response.data.task_status === "IN PROGRESS" ||
          response.data.task_status === "PENDING"
        ) {
          setTimeout(() => {
            this.checkTaskStatus(taskId);
          }, 5000);
        } else if (response.data.task_status === "SUCCESS") {
          this.$notify({
            title: "BOM Uploaded Successfully",
            type: "bg-success-subtle text-success",
            duration: "5000",
          });
          this.$router.push("/bom");
          this.$store.commit("setIsLoading", false);
        } else {
          this.$notify({
            title: "BOM Upload Failed",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.$store.commit("setIsLoading", false);
        }
      } catch (error) {
        console.log("error:", error);
        this.$notify({
          title: "An error occurred, please try again later",
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
        this.$store.commit("setIsLoading", false);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];

      if (file) {
        console.log("Uploaded file:", file);
        this.uploadedFileName = file.name;
        this.uploadedFile = file; // Store the file directly, no need to read content
      }
    },
    saveChanges() {
      // Save the BOM revision change note to the variable
      this.bom_rev_change_note = this.bom_rev_change_note.trim();

      // Check if the BOM revision change note is not empty
      if (this.bom_rev_change_note !== "") {
        // Log the BOM revision change note to the console
        console.log("BOM Revision Change Note:", this.bom_rev_change_note);

        // Append the BOM revision change note to the form data
        // Assuming formData is defined at the beginning of the component's data
        // and it's used to store the data that will be sent in the request
        this.formData.append("bom_rev_change_note", this.bom_rev_change_note);

        // Clear the bom_rev_change_note variable if needed
        this.bom_rev_change_note = "";
      } else {
        // Handle the case when the BOM revision change note is empty
        // You can display an error message or take other appropriate actions
        console.log("Error: BOM Revision Change Note is empty");
      }
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
