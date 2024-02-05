<template>
  <div v-if="isLoading" class="container text-center">
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
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Orders</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <a href="/"><i class="fas fa-home me-1"></i>Home</a>
              </li>
              <li class="breadcrumb-item active">
                <router-link to="/orders">
                  <i class="fas fa-shopping-cart me-1"></i>
                  Orders
                </router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fa-solid fa-receipt me-1"></i>
                Create Order
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- Buttons Column -->
      <div class="col-md-6 d-flex justify-content-end mt-4">
        <!-- <router-link to="/create-bom" class="btn btn-primary btn-sm ms-2">
                Create BOM
              </router-link> -->
        <button type="button" class="btn-sm btn-primary" @click="createOrder">
          Create Order
        </button>
      </div>
    </div>
    <!-- Rest of your component -->
    <!-- <OrderDetailsTable
          style="margin-top: 20px"
          :orders="orders"
          @rowClicked="handleRowClicked"
          @rowSelected="handleRowSelected"
        /> -->

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
            @change="filteredBoms"
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
      <div v-if="selectedRadio === 'uploadNewBom'" class="row mb-3">
        <div class="col-md-6">
          <label for="bomType" class="form-label">BOM Type</label>
          <input
            type="text"
            class="form-control"
            id="bomType"
            v-model="bomType"
          />
        </div>

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
        <div class="col-md-6">
          <label for="batchQuantity" class="form-label">
            <i class="fas fa-flask me-2"></i>Batch Quantity
          </label>
          <input
            v-model="order.batchQuantity"
            type="number"
            class="form-control"
            placeholder="Enter Batch Quantity"
            min="1"
            required
          />
        </div>
        <div v-if="selectedRadio === 'uploadNewBom'" class="col-md-6">
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
      <div v-if="selectedRadio === 'uploadNewBom'" class="card p-3 mb-4">
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

      <div class="radio-button">
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
            v-model="selectedRadio"
            value="uploadNewBom"
          />
          <label class="form-check-label" for="flexRadioDefault1">
            Upload a new BOM
          </label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
            v-model="selectedRadio"
            value="selectBom"
          />
          <label class="form-check-label" for="flexRadioDefault2">
            Select BOM
          </label>
        </div>
      </div>
      <div v-if="selectedRadio === 'selectBom'">
        <button
          type="button"
          class="btn btn-primary mt-4"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          {{ selectBomButtonText }}
        </button>
      </div>
    </section>

    <!-- Button trigger modal -->

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Details</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <OrderBomDetailsVue
              :bomByProducts="bomByProducts"
              @rowClicked="handleRowClicked"
              @rowSelected="handleRowSelected"
              @rowDeselected="handleRowDeselected"
            ></OrderBomDetailsVue>
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

    <CustomModal
      :show="isCustomModalVisible"
      @close-modal="handleCloseModal"
      @handle-modal-submitted="handleModalSubmission"
      @dismiss-modal="handleCloseModal"
    />
  </div>
</template>

<script>
import axios from "axios";
import OrderBomDetailsVue from "../components/OrderBomDetails.vue";
import CustomModal from "../components/CustomModal.vue";

export default {
  components: { OrderBomDetailsVue, CustomModal },
  data() {
    return {
      // selectedRow: null,

      selectedRadio: null,
      issueDate: "",
      order: {
        selectedBomId: null,
        batchQuantity: 1,
      },

      boms: [],
      projects: [],
      products: [],
      orders: [],
      selectedProduct: null,
      selectedProject: null,
      bomByProducts: [],
      selectedBomFileName: "",
      selectedBomId: null,
      selectBomButtonText: "Select BOM",
      bomRevNo: null,
      isValidBomRevNo: true,
      bomType: null,
      uploadedFileName: null,
      uploadedFile: null,
      isLoading: false,
      bom_rev_change_note: "",
      isCustomModalVisible: false,
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

    prepopulatedIssueDate() {
      // Check if there is at least one filtered BOM
      if (this.bomByProducts.length > 0) {
        // Use the "issue_date" of the first filtered BOM as the prepopulated value
        return this.bomByProducts[0].issue_date;
      } else {
        // If no filtered BOMs, return a default value or null
        return null;
      }
    },
    formattedIssueDate() {
      // Format the date as "yyyy-MM-dd"
      if (this.prepopulatedIssueDate) {
        const [month, day, year] = this.prepopulatedIssueDate.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      } else {
        return null;
      }
    },
  },
  mounted() {
    // Fetch data when the component is created
    this.getData();
  },
  methods: {
    openCustomModal() {
      this.isCustomModalVisible = true;
    },
    handleCloseModal() {
      this.isCustomModalVisible = false;
    },

    validateBomRevNo() {
      const bomRevNoRegex = /^(1\.[0-9]|1[0-9]|2\.0)$/;

      if (bomRevNoRegex.test(this.bomRevNo)) {
        this.isValidBomRevNo = true;
      } else {
        this.isValidBomRevNo = false;
      }
    },
    setIsLoading(isLoading) {
      this.isLoading = isLoading;
      this.$store.commit("setIsLoading", isLoading);
    },

    notifySuccess(message) {
      this.$notify({
        title: message,
        type: "bg-success-subtle text-success",
        duration: "5000",
      });
    },

    notifyError(message) {
      this.$notify({
        title: message,
        type: "bg-danger-subtle text-danger",
        duration: "5000",
      });
    },

    handleError(message) {
      this.notifyError(message);
      this.setIsLoading(false);
    },

    handleFileUpload(event) {
      const file = event.target.files[0];

      if (file) {
        console.log("Uploaded file:", file);
        this.uploadedFileName = file.name;
        this.uploadedFile = file; // Store the file directly, no need to read content
      }
    },

    async getData() {
      try {
        // Replace 'store/get-projects/' with your actual API endpoint
        this.setIsLoading(true);
        const response = await axios.get("store/create-order/");
        console.log("boms + products + projects", response.data);
        this.setIsLoading(false);
        this.boms = response.data.boms;
        this.projects = response.data.projects;
        this.products = response.data.products;
        this.orders = response.data.orders;
      } catch (error) {
        console.error("Error fetching projects:", error);
        this.setIsLoading(false);
      }
    },
    filteredBoms() {
      // Check if both boms and selectedProduct are available and not undefined
      console.log(this.selectedProduct);
      if (this.boms && this.selectedProduct !== null) {
        // Filter boms based on the selected product
        this.bomByProducts = this.boms.filter((bom) => {
          return bom.product.id === this.selectedProduct;
        });

        console.log("Filtered Boms i.e bomByProducts=:", this.bomByProducts);
      } else {
        // If either boms or selectedProduct is not available, reset bomByProducts
        console.log("No Boms or Selected Product available.");
        this.bomByProducts = [];
      }
    },

    handleRowClicked(rowData) {
      // Handle the row click event with the rowData
      console.log("Row Clicked:", rowData);
      this.selectedBomFileName = rowData.bom_file_name;
      this.selectedBomId = rowData.id;
    },
    handleRowSelected(selectedRow) {
      // Handle the row selection event with the selectedRow
      console.log("Row Selected:", selectedRow);
      this.selectedBomFileName = selectedRow.bom_file_name;
      this.selectedBomId = selectedRow.id;
    },
    handleRowDeselected() {
      // Handle the row deselection event
      console.log("Row Deselected");
    },
    saveChanges() {
      // Check if a BOM is selected
      if (this.selectedBomFileName && this.selectedBomId !== null) {
        // Update the button text with the selected BOM file name
        this.selectBomButtonText = this.selectedBomFileName;
        this.order.selectedBomId = this.selectedBomId;

        // Perform any other actions you need
        console.log("Selected BOM File Name:", this.selectedBomFileName);
        console.log("Selected BOM ID:", this.selectedBomId);
      } else {
        // Handle the case where no BOM is selected
        console.warn("No BOM selected.");

        // Reset the button text to "Select BOM"
        this.selectBomButtonText = "Select BOM";
      }

      // Reset selected values for the next selection
      this.selectedBomFileName = "";
      this.selectedBomId = null;
    },
    async createSelectedBOMOrder() {
      this.setIsLoading(true);
      await axios
        .post("store/create-order/", this.order)
        .then((response) => {
          console.log("Order Created:", response.data);
          this.notifySuccess("Order Created Successfully");
          this.setIsLoading(false);
          this.$router.push("/orders");
        })
        .catch((error) => {
          console.error("Error creating order:", error);
          this.handleError("Order Creation Failed");
        });
    },
    createOrder() {
      this.setIsLoading(true);
      if (this.selectedRadio === "selectBom") {
        this.createSelectedBOMOrder();
      } else if (this.selectedRadio === "uploadNewBom") {
        this.createBomTask();
      }
    },

    async createBomTask() {
      this.setIsLoading(true);
      const formData = new FormData();
      formData.append("project_id", this.selectedProject);
      formData.append("product_id", this.selectedProduct);
      formData.append("bom_type", this.bomType);
      formData.append("bom_rev_no", this.bomRevNo);
      formData.append("issue_date", this.issueDate);
      formData.append("batch_quantity", this.order.batchQuantity);
      formData.append("bom_file", this.uploadedFile);

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

        console.log("Response from handle-bom-cases API:", responseCases.data);

        if (responseCases.status === 200) {
          // Case 1: BOM already exists
          // this.$store.commit("setIsLoading", false);
          this.setIsLoading(false);
          console.log("hi", responseCases.data.message);

          this.$notify({
            title: `BOM Already Exists With Rev No: ${responseCases.data.bom_rev_number}`,
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
        }
        //case 2----------------------------
        else if (responseCases.status === 201) {
          // Case 2: New BOM revision number for an existing product
          this.setIsLoading(false);
          console.log("inside case two block");
          console.log(responseCases.data.message);

          // Log the value of isCustomModalVisible before setting it
          console.log(
            "Before setting isCustomModalVisible:",
            this.isCustomModalVisible
          );

          // Try setting it to true
          this.isCustomModalVisible = true;

          // Log the value of isCustomModalVisible after setting it
          console.log(
            "After setting isCustomModalVisible:",
            this.isCustomModalVisible
          );
        } else if (responseCases.status === 204) {
          // Case 3: New BOM revision number, no BOM uploaded yet (HTTP 204 No Content)
          console.log(responseCases.data.message);
          this.setIsLoading(true);

          const responseUploadBOM = await axios.post(
            "store/create-order-task/",
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
              title: "BOM Uploaded Successfully adn Order Created",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
            this.setIsLoading(false);
            this.$router.push("/orders");
          } else {
            this.$notify({
              title: "BOM Upload Failed",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
            this.setIsLoading(false);
          }
        }
      } catch (error) {
        console.log("error:", error);
        this.$notify({
          title: "An error occurred, please try again later",
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
        this.setIsLoading(false);
      }

      // await axios
      //   .post("store/create-order-task/", formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   })
      //   .then((response) => {
      //     console.log(response.data);
      //     const task_id = response.data.task_id;

      //     if (
      //       response.data.task_status === "IN PROGRESS" ||
      //       response.data.task_status === "PENDING"
      //     ) {
      //       setTimeout(() => {
      //         this.checkTaskStatus(task_id);
      //       }, 10000);
      //     } else if (response.data.task_status === "SUCCESS") {
      //       this.setIsLoading(false);
      //       this.notifySuccess("BOM Uploaded and Order Created Successfully");
      //       this.$router.push("/orders");
      //     } else {
      //       this.notifyError("BOM Upload and Order Creation Failed");
      //       this.setIsLoading(false);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log("error:", error);
      //     this.handleError("An error occurred, please try again later");
      //   });
    },

    async createOrderAndUploadBom(formData) {
      this.setIsLoading(true);
      try {
        const responseUploadBOM = await axios.post(
          "store/create-order-task/",
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
          this.setIsLoading(false);
          this.$router.push("/bom");
        } else {
          this.$notify({
            title: "BOM Upload Failed",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.setIsLoading(false);
        }
      } catch (error) {
        console.log("error:", error);
        this.$notify({
          title: "An error occurred, please try again later",
          type: "bg-danger-subtle text-danger",
          duration: "5000",
        });
        this.setIsLoading(false);
      }
    },
    async handleModalSubmission(bomRevChangeNote) {
      console.log(
        "inside handleModal Submisison which will revece CHANGE NOTE IN ARFUMENT"
      );

      console.log("this is the change note ", bomRevChangeNote);

      const formData = new FormData();
      formData.append("project_id", this.selectedProject);
      formData.append("product_id", this.selectedProduct);
      formData.append("bom_type", this.bomType);
      formData.append("bom_rev_no", this.bomRevNo);
      formData.append("issue_date", this.issueDate);
      formData.append("bom_file", this.uploadedFile);
      formData.append("bom_rev_change_note", bomRevChangeNote);

      console.log("FormData:", formData);
      await this.createOrderAndUploadBom(formData);
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
          this.notifySuccess("BOM Uploaded and Order Created Successfully");
          this.setIsLoading(false);
          this.$router.push("/orders");
        } else {
          this.notifyError("BOM Upload Failed");
          this.setIsLoading(false);
        }
      } catch (error) {
        console.log("error:", error);
        this.handleError("An error occurred, please try again later");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-check-label {
  font-weight: bold;
}

/* Add this style to make radio buttons more visible with a border */
.form-check-input {
  border: 2px solid #3498db;
  border-radius: 50%;
  margin-right: 8px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

/* Optional: Add a style to highlight the selected radio button */
.form-check-input:checked {
  background-color: #3498db;
  transform: scale(1.1);
}

/* Add hover effect for radio buttons */
.form-check-input:hover {
  background-color: #3498db;
}

/* Add hover effect for labels */
.form-check-label:hover {
  color: #3498db;
}

/* Container styling */
.radio-button {
  display: inline-block;
  margin-right: 20px; /* Adjust the margin as needed */
}
</style>
