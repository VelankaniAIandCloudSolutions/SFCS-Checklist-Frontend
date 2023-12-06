<template>
  <div>
    <div class="container mt-4">
      <div class="card">
        <div class="card-body">
          <h2 class="card-title fw-bold mb-4">BOM Details</h2>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="fw-bold">Product Name:</label>
                <div>PRYSM-Zen-2</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">BOM Type:</label>
                <div>Type-A</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Issue Date:</label>
                <div>2023-12-01</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="fw-bold">Product Code:</label>
                <div>DAYTONA</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">BOM Rev No:</label>
                <div>Rev-001</div>
              </div>
              <div class="mb-3">
                <label class="fw-bold">Product Rev No:</label>
                <div>Rev-1</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add space between BOM details card and BomItemsTable component -->
      <div class="mt-4"></div>

      <!-- Include BomItemsTable component -->
      <BomItemsTable
        @rowClicked="handleRowClicked"
        @rowSelected="handleRowSelected"
      />
    </div>
  </div>
</template>

<script>
import BomItemsTable from "@/components/BomItemsTable"; // Adjust the path based on your project structure

export default {
  components: {
    BomItemsTable,
  },
  methods: {
    handleRowClicked(data) {
      // Handle row click
      console.log("Row clicked:", data);
    },
    handleRowSelected(data) {
      // Handle row selection
      console.log("Row selected:", data);
    },
  },
};
</script>

<style lang="scss" scoped>
/* Add custom styles if needed */
/* Optional: Add borders and additional styling for a more refined look */
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
