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
                <i class="fas fa-shopping-cart me-1"></i>
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
          <i class="fas fa-check me-2"></i>Create Order
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
      <div class="row mb-3">
        <!-- BOM Type -->

        <!-- Issue Date -->
        <div class="col-md-6">
          <label for="issueDate" class="form-label">Issue Date</label>
          <input
            type="date"
            class="form-control"
            id="issueDate"
            :value="formattedIssueDate"
            required
            readonly
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
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        {{ selectBomButtonText }}
      </button>
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
  </div>
</template>

<script>
import axios from "axios";
import OrderBomDetailsVue from "../components/OrderBomDetails.vue";

export default {
  components: { OrderBomDetailsVue },
  data() {
    return {
      // selectedRow: null,
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
        if (this.selectedProject !== null) {
          const filteredProducts = this.products.filter((product) => {
            const project = this.projects.find(
              (p) => p.id === product.project.id
            );
            return project && project.id === this.selectedProject;
          });

          console.log("Filtered Products:", filteredProducts);

          return filteredProducts;
        } else {
          // If selectedProject is null, return all products or an empty array
          console.log("All Products:", this.products);
          return this.products;
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
    async getData() {
      try {
        // Replace 'store/get-projects/' with your actual API endpoint
        const response = await axios.get("store/create-order/");
        console.log(response.data);
        this.boms = response.data.boms;
        this.projects = response.data.projects;
        this.products = response.data.products;
        this.orders = response.data.orders;
      } catch (error) {
        console.error("Error fetching projects:", error);
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

    async createOrder() {
      try {
        console.log("Order Object:", this.order);
        this.$store.commit("setIsLoading", true);

        // Make a POST request to the create_order API
        const response = await axios.post("store/create-order/", this.order);

        console.log("Order Created:", response.data);

        this.$notify({
          title: "Order Created Successfully",
          type: "bg-danger-subtle text-success",
          duration: "5000",
        });
        // Redirect to the /orders page (adjust the route accordingly)
        this.$router.push("/orders");
        this.$store.commit("setIsLoading", false);
      } catch (error) {
        console.error("Error creating order:", error);
        this.$store.commit("setIsLoading", false);
        // Show a failure notification
        this.$notify({
          title: "Order Creation Failed",
          type: "bg-danger-subtle text-danger ",
          duration: "5000",
        });
      }
      // Add any other logic related to creating an order here
    },
    // async loadProducts() {
    //   console.log("api for projects triggered");
    //   console.log("Selected Project:", this.selectedProject);
    //   if (this.selectedProject) {
    //     try {
    //       const response = await axios.get(
    //         `store/create-order/?project_id=${this.selectedProject}`
    //       );
    //       console.log("load products", response.data);

    //       this.products = response.data.products;
    //       this.bomsByProject = response.data.bomsByProject;
    //       console.log("products for this id=", this.products);
    //       console.log("boms for this project id=", this.bomsByProject);
    //     } catch (error) {
    //       console.error("Error fetching products:", error);
    //     }
    //   } else {
    //     this.products = []; // Clear products if no project is selected
    //   }
  },
};
</script>

<style lang="scss" scoped></style>
