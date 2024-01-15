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
          <h2 class="mb-0">Products</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <router-link to="/"
                  ><i class="fas fa-home me-1"></i> Home</router-link
                >
              </li>
              <li class="breadcrumb-item">
                <router-link to="/products"
                  ><i class="fas fa-users me-1"></i> Products</router-link
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-edit me-1"></i>
                Edit Product
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <!-- buttons to the right -->
      <div class="col-md-6 mt-4 text-end">
        <button
          type="submit"
          class="btn btn-success btn-sm"
          @click="updateProduct"
        >
          <i class="fas fa-save me-1"></i> Save Changes
        </button>
        <button
          type="button"
          class="btn btn-danger ms-2 btn-sm"
          @click="deleteProduct"
        >
          <i class="fas fa-trash me-1"></i> Delete Product
        </button>
      </div>
    </div>

    <div class="card animate__animated animate__fadeIn mt-5">
      <div class="card-header bg-primary text-white">
        <h4 class="card-title">
          <i class="fas fa-user me-1"></i> Product Information
        </h4>
      </div>
      <div class="card-body">
        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Product Name:</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-envelope"></i>
            </span>
            <input
              v-model="editedProduct.name"
              type="text"
              class="form-control"
              id="project_name"
              required
            />
          </div>
          <small v-if="!editedProduct.name" class="text-danger"
            >Project Name is required.</small
          >
        </div>
        <!-- First Name and Last Name -->
        <div class="mb-3 row">
          <div class="col">
            <label for="first_name" class="form-label">Product Code:</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-user"></i>
              </span>
              <input
                v-model="editedProduct.product_code"
                type="text"
                class="form-control"
                id="product_code"
                required
              />
            </div>
            <small v-if="!editedProduct.product_code" class="text-danger"
              >First Name is required.</small
            >
          </div>
          <div class="col">
            <label for="first_name" class="form-label">Product Rev No:</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-user"></i>
              </span>
              <input
                v-model="editedProduct.product_rev_number"
                type="text"
                class="form-control"
                id="product_rev_number"
                required
              />
            </div>
            <small v-if="!editedProduct.product_rev_number" class="text-danger"
              >Product Rev Number is required.</small
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditProduct",
  data() {
    return {
      editedProduct: {
        name: "",
        product_code: "",
        product_rev_number: "",
        // Add more fields as needed
      },
      product: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.$store.commit("setIsLoading", true);
      axios
        .get(`/store/create-product/${this.$route.params.id}`) // Replace with your actual API endpoint
        .then((response) => {
          console.log("response.data", response.data);
          this.product = response.data.product;

          if (this.product) {
            this.editedProduct.name = this.product.name;
            this.editedProduct.product_code = this.product.product_code;
            this.editedProduct.product_rev_number =
              this.product.product_rev_number;
          }

          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          this.$store.commit("setIsLoading", false);
        });
    },

    updateProduct() {
      // Update user data using the put request
      if (confirm("Are you sure you want to update this product?")) {
        this.$store.commit("setIsLoading", true);
        axios
          .put(
            `/store/create-product/${this.$route.params.id}/`,
            this.editedProduct
          )
          .then((response) => {
            console.log("Product updated successfully:", response.data);
            // Redirect to the user list page or perform other actions as needed
            this.$store.commit("setIsLoading", false);
            alert("Product Updated successfully!");
            // location.reload();
          })
          .catch((error) => {
            console.error("Error updating Product:", error);
            this.$store.commit("setIsLoading", false);
          });
      }
    },
    deleteProduct() {
      // Confirm deletion with the user
      console.log(this.params.id);
      if (confirm("Are you sure you want to delete this user?")) {
        this.$store.commit("setIsLoading", true);

        // Delete user data using the delete request
        axios
          .delete(`/store/delete-product/${this.params.data.id}/`)
          .then(() => {
            console.log("Product  deleted successfully.");

            this.$store.commit("setIsLoading", false);
            alert("Product Deleted successfully!");

            // Redirect to the user list page or perform other actions as needed
            this.$router.push(`/project-edit/${this.product.project}`);
          })
          .catch((error) => {
            alert("error deleting!");
            console.error("Error deleting user:", error);
          });
      }
    },
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
/* Example animation classes from animate.css */
.animate__animated {
  animation-duration: 1s;
}

.animate__fadeIn {
  animation-name: fadeIn;
}

.animate__fadeInUp {
  animation-name: fadeInUp;
}

/* Add more custom styling as needed */
</style>
