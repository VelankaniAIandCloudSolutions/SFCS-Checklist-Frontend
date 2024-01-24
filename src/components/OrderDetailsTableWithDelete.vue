<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="orders"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      :rowSelection="'multiple'"
      @rowClicked="onRowClicked"
      @selectionChanged="onSelectionChanged"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";

export default {
  name: "App",
  components: {
    AgGridVue,
  },
  props: {
    orders: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      colDefs: [
        {
          field: "id",
          headerName: "Order ID",
          hide: true,
        },
        {
          field: "bom.id",
          headerName: "BOM ID ",
          hide: true,
        },

        {
          field: "bom.product.project.name",

          // headerCheckboxSelection: true,
          checkboxSelection: true,
          headerName: "Project Name",
        },

        { field: "bom.product.name", headerName: "Product" },
        { field: "batch_quantity", headerName: "Batch Quantity" },

        {
          field: "bom.bom_file_name",
          headerName: "File Name",
        },
        {
          headerName: "Download",
          cellRenderer: this.editButtonRenderer,
        },
        {
          headerName: "Actions",
          field: "actions",
          cellRenderer: this.actionsCellRenderer,
          sortable: false,
          filter: false,
        },
      ],

      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        autoSize: true,
      },
      selectedRows: [],
    };
  },

  methods: {
    onRowClicked(params) {
      this.$emit("rowClicked", params.data);
    },
    // onRowSelected(params) {
    //   // Emit an event with the selected row data
    //   if (params.node.isSelected()) {
    //     this.$emit("rowSelected", params.node.data);
    //   }
    // },
    onSelectionChanged(params) {
      const selectedData = params.api.getSelectedRows();
      const selectedRow = selectedData.length > 0 ? selectedData[0] : null;
      if (selectedRow) {
        this.$emit("rowSelected", selectedRow);
      } else {
        this.$emit("rowDeselected");
      }
    },
    editButtonRenderer(params) {
      console.log(params);
      const button = document.createElement("button");
      button.innerHTML = `<i class="fas fa-download"></i>`;
      button.classList.add("btn-sm", "btn-primary");

      // Disable the button if no rows are selected or if more than one row is selected
      button.addEventListener("click", () =>
        this.downloadFile(params.data.bom.bom_file_url)
      );
      return button;
    },

    actionsCellRenderer(params) {
      // const editButton = document.createElement("button");
      // editButton.innerHTML = `<i class="fas fa-edit"></i>`;
      // editButton.classList.add("btn-sm", "btn-primary", "me-2");
      // editButton.addEventListener("click", () =>
      //   this.onEditClick(params.data.id)
      // );

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
      deleteButton.classList.add("btn-sm", "btn-danger", "ms-2");
      deleteButton.addEventListener("click", () =>
        this.deleteProduct(params.data.id)
      );

      const container = document.createElement("div");
      // container.appendChild(editButton);
      container.appendChild(deleteButton);

      return container;
    },
    onEditClick(id) {
      this.$router.push(`/product/edit/${id}`);
    },
    async deleteProduct(id) {
      // Confirm deletion with the user
      console.log("order id", id);
      if (confirm("Are you sure you want to delete this Order?")) {
        this.$store.commit("setIsLoading", true);

        try {
          // Delete user data using the delete request
          const response = await axios.delete(`/store/delete-order/${id}/`);

          console.log("Response:", response);

          if (response.status === 204) {
            console.log("Order deleted successfully.");

            this.$store.commit("setIsLoading", false);

            this.$notify({
              title: "Order Deleted Successfully",
              type: "bg-success-subtle text-success",
              duration: "5000",
            });

            // Redirect to the user list page or perform other actions as needed
            // this.$router.push(`/project-edit/${this.product.project}`);
            window.location.reload();
          } else {
            console.error(
              "Error deleting Order. Unexpected status:",
              response.status
            );

            this.$notify({
              title: "Order Deletion Unsuccessful",
              type: "bg-danger-subtle text-danger",
              duration: "5000",
            });

            this.$store.commit("setIsLoading", false);
          }
        } catch (error) {
          console.error("Error deleting Order:", error);

          this.$notify({
            title: "Order Deletion Unsuccessful",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });

          this.$store.commit("setIsLoading", false);
        }
      }
    },

    downloadFile(fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank"; // Open in a new tab
      link.download = "BOM_File"; // You can set a default filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // onEditClick(id) {
    //   this.$router.push(`/bom/edit/${id}`);
    // },
  },
};
</script>

<style scoped></style>
