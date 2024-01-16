<!-- manufacturer-parts-grid.vue -->
<template>
  <div class="ag-theme-quartz" style="height: 600px">
    <ag-grid-vue
      ref="agGrid"
      :gridOptions="gridOptions"
      :columnDefs="columnDefs"
      :rowData="products"
      @rowClicked="onRowClicked"
      @rowSelected="onRowSelected"
    ></ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";

import axios from "axios";

export default {
  components: {
    "ag-grid-vue": AgGridVue,
  },
  props: {
    products: {
      type: Array,
      default: () => [],
    },
    selectedProducts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      gridOptions: {
        domLayout: "autoHeight",
        rowSelection: "multiple",
        pagination: true, // Enable pagination
        paginationPageSize: 20,
        // Set the number of rows per page
      },
      columnDefs: [
        {
          headerCheckboxSelection: true,
          checkboxSelection: true,
          headerName: "Product name",
          field: "name",
        },
        { headerName: "Product Code", field: "product_code" },
        { headerName: "Product Rev No", field: "product_rev_number" },
        {
          headerName: "Actions",
          field: "actions",
          cellRenderer: this.actionsCellRenderer,
          sortable: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    onRowClicked(params) {
      // Emit an event with the clicked row data
      this.$emit("rowClicked", params.data);
      this.$router.push(`/product/edit/${params.data.id}`);
    },
    onRowSelected(params) {
      // Emit an event with the selected row data
      if (params.node.isSelected()) {
        this.$emit("rowSelected", params.data);
      }
    },
    onSelectionChanged() {
      if (this.$refs.agGrid && this.$refs.agGrid.api) {
        this.selectedRows = this.$refs.agGrid.api.getSelectedRows();
      }
    },
    actionsCellRenderer(params) {
      const editButton = document.createElement("button");
      editButton.innerHTML = `<i class="fas fa-edit"></i>`;
      editButton.classList.add("btn", "btn-primary");
      editButton.addEventListener("click", () =>
        this.onEditClick(params.data.id)
      );

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
      deleteButton.classList.add("btn", "btn-danger", "ms-1");
      deleteButton.addEventListener("click", () =>
        this.deleteProduct(params.data.id)
      );

      const container = document.createElement("div");
      container.appendChild(editButton);
      container.appendChild(deleteButton);

      return container;
    },
    onEditClick(id) {
      this.$router.push(`/product/edit/${id}`);
    },

    async deleteProduct(id) {
      // Confirm deletion with the user
      if (confirm("Are you sure you want to delete this user?")) {
        this.$store.commit("setIsLoading", true);

        try {
          // Delete user data using the delete request
          const response = await axios.delete(`/store/delete-product/${id}/`);

          console.log("Response:", response);

          if (response.status === 204) {
            console.log("Product deleted successfully.");

            this.$store.commit("setIsLoading", false);

            this.$notify({
              title: "Product Deleted Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });

            // Redirect to the user list page or perform other actions as needed
            // this.$router.push(`/project-edit/${this.product.project}`);
            window.location.reload();
          } else {
            console.error(
              "Error deleting product. Unexpected status:",
              response.status
            );

            this.$notify({
              title: "Product Deletion Unsuccessful",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });

            this.$store.commit("setIsLoading", false);
          }
        } catch (error) {
          console.error("Error deleting product:", error);

          this.$notify({
            title: "Product Deletion Unsuccessful",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });

          this.$store.commit("setIsLoading", false);
        }
      }
    },
  },
};
</script>

<style scoped>
.ag-theme-quartz {
  display: block;
}
</style>
