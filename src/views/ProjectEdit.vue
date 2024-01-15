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

  <div v-else class="container mt-4">
    <div class="row align-items-center">
      <div class="col-md-8 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Edit Project |</h2>
          <nav aria-label="breadcrumb" class="ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0 justify-content-end">
              <li class="breadcrumb-item">
                <a href="/"> <i class="fas fa-home me-1"></i>Home</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <router-link to="/projects">
                  <i class="fas fa-project-diagram me-1"></i>Projects
                </router-link>
              </li>

              <li class="breadcrumb-item active" aria-current="page">
                <i class="fa fa-bars me-1" aria-hidden="true"></i>Project
                Details
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="col-md-4 mt-4 d-flex justify-content-end">
        <button type="button" class="btn btn-success me-2" @click="saveChanges">
          Update Changes
        </button>
        <button type="button" class="btn btn-danger" @click="confirmDelete">
          Delete Project
        </button>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-8 offset-md-2">
        <!-- Display BOM fields within sections -->
        <section>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="veplPartNumber">Project Name</label>
                <input
                  v-model="editedProject.name"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="level">Project Code</label>
                <input
                  v-model="editedProject.project_code"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="priorityLevel">Project Rev No</label>
                <input
                  v-model="editedProject.project_rev_number"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <!-- Add other fields in a similar fashion -->

          <!-- <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="value">Value</label>
                <input
                  v-model="editedBom.value"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="pcbFootprint">PCB Footprint</label>
                <input
                  v-model="editedBom.pcb_footprint"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="lineItemType">Type</label>
                <select v-model="editedBom.line_item_type" class="form-control">
                  <option
                    v-for="type in line_item_types"
                    :key="type.id"
                    :value="type.id"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <input
              v-model="editedBom.description"
              type="text"
              class="form-control"
            />
          </div>

           <div class="form-group">
              <label for="references">References</label>
              <input
                :value="getReferences(editedBom.references)"
                type="text"
                class="form-control"
                disabled
              />
            </div> -->
          <!-- <div class="form-group">
            <label for="references">References</label>
            <div>
              <div
                v-for="reference in editedBom.references"
                :key="reference.id"
                class="tag"
              >
                {{ reference.name }}
                <span @click="removeReference(reference)" class="remove-tag"
                  >X</span
                >
              </div>
            </div>
            <input
              v-model="newReference"
              @keyup.enter="addNewReference"
              type="text"
              placeholder="Type to add a new reference"
              class="form-control mt-2"
            />
          </div> -->

          <div class="form-group">
            <label for="products">Products</label>
            <br />

            <!-- <input
                :value="getManufacturerParts(editedBom.manufacturer_parts)"
                type="text"
                class="form-control"
                disabled
              /> -->
            <!-- <div>
              <div
                v-for="(product, index) in editedProject.products"
                :key="product.id"
                class="tag"
              >
                {{ index + 1 }}. {{ product.name }} - {{ product.product_code }}
              </div>
            </div> -->
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Add Product
            </button>
            <products-for-project-grid
              style="margin-top: 20px"
              :products="project.products"
              @rowSelected="handleRowSelected"
            >
            </products-for-project-grid>
          </div>

          <!-- <div class="form-group">
            <label for="customerPartNumber">Customer Part Number</label>
            <input
              v-model="editedBom.customer_part_number"
              type="text"
              class="form-control"
            />
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="quantity">Quantity</label>
                <input
                  v-model="editedBom.quantity"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="uom">UOM</label>
                <input
                  v-model="editedBom.uom"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
          </div> -->

          <!-- <div class="form-group">
              <label for="assemblyStage">Assembly Stage</label>
              <input
                v-model="editedBom.assembly_stage.name"
                type="text"
                class="form-control"
              />
            </div> -->

          <!-- <div class="form-group">
            <label for="assemblyStage">Assembly Stage</label>
            <select v-model="editedBom.assembly_stage" class="form-control">
              <option
                v-for="type in assembly_stages"
                :key="type.id"
                :value="type.id"
              >
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="ecn">ECN</label>
            <input v-model="editedBom.ecn" type="text" class="form-control" />
          </div>

          <div class="form-group">
            <label for="msl">MSL</label>
            <input v-model="editedBom.msl" type="text" class="form-control" />
          </div>

          <div class="form-group">
            <label for="remarks">Remarks</label>
            <input
              v-model="editedBom.remarks"
              type="text"
              class="form-control"
            />
          </div> -->
        </section>

        <!-- Buttons for Save Changes and Delete -->
      </div>
    </div>
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
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Create New Product
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- <manufacturer-parts-grid
              :manufacturerParts="manufacturerParts"
              :selectedManufacturerParts="editedBom.manufacturer_parts"
              @update:selectedManufacturerParts="updateManufacturerParts"
            ></manufacturer-parts-grid> -->
            <div class="card mt-4">
              <div class="card-header bg-primary text-white">
                <h4 class="card-title">
                  <i class="fas fa-Product-diagram me-2"></i> Product
                  Information
                </h4>
              </div>
              <div class="card-body">
                <!-- product Name -->
                <div class="mb-3">
                  <label for="productName" class="form-label"
                    >Product Name:</label
                  >
                  <input
                    v-model="newProduct.name"
                    type="text"
                    class="form-control"
                    id="productName"
                    required
                  />
                  <small v-if="!newProduct.name" class="text-danger"
                    >Product Name is required.</small
                  >
                </div>
                <!-- Product Code -->
                <div class="mb-3">
                  <label for="productCode" class="form-label"
                    >Product Code:</label
                  >
                  <input
                    v-model="newProduct.product_code"
                    class="form-control"
                    id="productCode"
                    required
                  />
                  <small v-if="!newProduct.product_code" class="text-danger"
                    >Product Code is required.</small
                  >
                </div>
                <!-- Product Rev No -->
                <div class="mb-3">
                  <label for="ProductRevNo" class="form-label"
                    >Product Rev No:</label
                  >
                  <input
                    v-model="newProduct.product_rev_number"
                    type="text"
                    class="form-control"
                    id="productRevNo"
                    required
                  />
                  <small
                    v-if="!newProduct.product_rev_number"
                    class="text-danger"
                    >Product Rev No is required.</small
                  >
                </div>
                <!-- ... (unchanged code) ... -->
              </div>
            </div>
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
              @click="createProduct"
            >
              <i class="fas fa-save me-1"></i> Create New Product
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ProductsForProjectGrid from "../components/ProductsForProjectGrid.vue";
// import CreateProduct from "../components/CreateProduct.vue";

export default {
  components: {
    "products-for-project-grid": ProductsForProjectGrid,
    // CreateProduct,
  },
  // props: {
  //   bom_id: {
  //     type: Number,
  //     required: true, // Set the type to Number if the ID is an integer
  //   },
  // },

  data() {
    return {
      editedProject: {
        name: "",
        project_code: "", // Add this line
        project_rev_number: "", // Add this line
        products: [],
      },
      newProduct: {
        name: "",
        product_code: "",
        product_rev_number: "",
        // Add more fields as needed
      },

      project: [],
      products: [],
    };
  },
  mounted() {
    // Fetch data when the component is mounted

    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.$store.commit("setIsLoading", true);
      axios
        .get(`/store/create-project/${this.$route.params.id}`) // Replace with your actual API endpoint
        .then((response) => {
          console.log("response.data", response.data);
          this.project = response.data.project;
          if (this.project) {
            this.editedProject.name = this.project.name;
            this.editedProject.project_code = this.project.project_code;
            this.editedProject.project_rev_number =
              this.project.project_rev_number;
          }

          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          this.$store.commit("setIsLoading", false);
        });
    },
    // updateProducts(selectedProducts) {
    //   this.editedProject.products = selectedProducts;
    // },
    saveChanges() {
      // Log the editedProject object
      console.log("Edited Project:", this.editedProject);

      // Add logic to save changes to the backend if needed
      // ...

      // You can also redirect to another page or perform other actions
      // after saving changes if needed
    },
    createProduct() {
      // Check if the form is valid before creating a new Product

      this.$store.commit("setIsLoading", true);
      console.log("form data", this.newProduct);

      if (
        this.newProduct.name &&
        this.newProduct.product_code &&
        this.newProduct.product_rev_number
      ) {
        // Create a new Product using the post request
        axios
          .post(
            `/store/create-product/${this.$route.params.id}/`,
            this.newProduct
          )
          .then((response) => {
            console.log("Product created successfully:", response.data);
            this.$store.commit("setIsLoading", false);
            // Display a success message

            this.$notify({
              title: "Product Created Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
            const projectId = this.$route.params.id;
            this.$router.push(`/project-edit/${projectId}`);
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error creating Product:", error);
            this.$store.commit("setIsLoading", false);
            this.$notify({
              title: "Product Creation Unsuccessful",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });
          });
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
.form-group {
  margin-bottom: 20px;
}
.tag {
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 5px;
  background-color: #e0e0e0;
  border-radius: 3px;
}

.remove-tag {
  cursor: pointer;
  margin-left: 5px;
  color: red;
}

.animate__animated {
  animation-duration: 1s;
}

.animate__fadeIn {
  animation-name: fadeIn;
}

.animate__fadeInUp {
  animation-name: fadeInUp;
}
</style>
