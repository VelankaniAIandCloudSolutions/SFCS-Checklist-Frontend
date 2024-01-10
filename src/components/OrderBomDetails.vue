<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="bomByProducts"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
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
  name: "OrderBomDetails",
  components: {
    AgGridVue,
  },
  props: {
    // id: {
    //   type: Number,
    //   required: true,
    // },
    bomByProducts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // Add more rows as needed

      colDefs: [
        {
          field: "id",
          // headerCheckboxSelection: true,
          checkboxSelection: true,

          headerName: "BOM ID",
        },
        {
          field: "product.project.name",

          headerName: "Project Name",
        },
        {
          field: "product.name",

          headerName: "Product Name",
        },

        {
          field: "product.product_code",
          headerName: "Product Code",
        },
        {
          field: "bom_type.name",
          headerName: "BOM Type",
        },

        { field: "issue_date", headerName: "Issue Date" },
        {
          field: "product.product_rev_number",
          headerName: "Product Rev No",
        },

        {
          headerName: "Download",
          cellRenderer: this.editButtonRenderer,
        },
      ],

      defaultColDef: {
        filter: true, // Enable filtering by default for all columns
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
      button.innerHTML = `<i class="fas fa-download"></i> ${params.data.bom_file_name} `;
      button.classList.add("btn-sm", "btn-primary");

      // Disable the button if no rows are selected or if more than one row is selected
      button.addEventListener("click", () =>
        this.downloadFile(params.data.bom_file_url)
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
