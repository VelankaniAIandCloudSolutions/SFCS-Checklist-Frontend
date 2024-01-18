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
    downloadFile(fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank"; // Open in a new tab
      link.download = "BOM_File"; // You can set a default filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    onEditClick(id) {
      this.$router.push(`/bom/edit/${id}`);
    },
  },
};
</script>

<style scoped></style>
