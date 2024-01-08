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

    <section>
      <!-- Project Name -->
      <div class="mb-3 mt-4">
        <label for="bom" class="form-label">
          <i class="fas fa-project-diagram me-2"></i>Select BOM
        </label>
        <select
          v-model="order.selectedBOM"
          class="form-select"
          @change="openBOMDetailsModal"
        >
          <option v-for="bom in boms" :key="bom.id" :value="bom.id">
            {{ bom.product.name }}
          </option>
        </select>
      </div>

      <!-- Batch Quantity -->
      <div class="mb-3">
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
    </section>
    <!-- Button trigger modal -->
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
    >
      Launch demo modal
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  //   components: { OrderDetailsTable },
  data() {
    return {
      // selectedRow: null,
      order: {
        projectName: "",
        productName: "",
        batchQuantity: 1,
      },
      boms: [],
    };
  },
  methods: {
    async getBOMs() {
      // Assuming you are using axios for HTTP requests
      await axios
        .get("/store/get-boms")
        .then((response) => {
          // Update bomList with the fetched BOMs
          console.log(response.data.boms);
          this.boms = response.data.boms;
        })
        .catch((error) => {
          console.error("Error fetching BOMs:", error);
        });
    },
    openBOMDetailsModal() {},
  },

  mounted() {
    // Fetch data when the component is created
    this.getBOMs();
  },
};
</script>

<style lang="scss" scoped></style>
