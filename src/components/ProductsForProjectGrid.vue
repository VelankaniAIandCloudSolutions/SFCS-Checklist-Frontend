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
          width: 300,
        },
        { headerName: "Product Code", field: "product_code", width: 300 },
        {
          headerName: "Product Rev No",
          field: "product_rev_number",
          width: 300,
        },
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
      editButton.classList.add("btn", "btn-primary", "ms-2");
      editButton.addEventListener("click", () =>
        this.onEditClick(params.data.id)
      );

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
      deleteButton.classList.add("btn", "btn-danger", "ms-4");
      deleteButton.addEventListener("click", (event) =>
        this.deleteProduct(params.data.id, event)
      );

      const container = document.createElement("div");
      container.appendChild(editButton);
      container.appendChild(deleteButton);

      return container;
    },
    onEditClick(id) {
      this.$router.push(`/product/edit/${id}`);
    },

    async deleteProduct(id, event) {
      // Confirm deletion with the user
      event.stopPropagation();
      if (confirm("Are you sure you want to delete this product?")) {
        this.$store.commit("setIsLoading", true);

        // Delete user data using the delete request
        axios
          .delete(`/store/delete-product/${id}/`)
          .then((response) => {
            console.log(response.data);
            console.log("Product deleted successfully.");

            this.$store.commit("setIsLoading", false);
            this.$notify({
              title: "Product Deleted Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });
            // const projectId = this.product.project;
            // this.$router.push(`/project-edit/${this.$route.params.id}`);
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            this.$notify({
              title: "Product Deletion Unsuccessful",
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
.ag-theme-quartz {
  display: block;
}
</style>
