<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :columnDefs="colDefs"
      :pagination="true"
      @rowClicked="onRowClicked"
      @rowSelected="onRowSelected"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
  name: "BomItemDetails",
  components: {
    AgGridVue,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      rowData: [
        {
          id: 1,
          level: "A",
          "VEPL Part No": "VEPL-123",
          "Priority Level": "High",
          Value: "100",
          "PCB Footprint": "Footprint-1",
          Type: "Type-X",
          Description: "Sample Description 1",
          Mfr: "Manufacturer-1",
          "Mfr. Part No": "MFR123",
          Till: "2023-12-15",
        },
        {
          id: 2,
          level: "B",
          "VEPL Part No": "VEPL-456",
          "Priority Level": "Medium",
          Value: "200",
          "PCB Footprint": "Footprint-2",
          Type: "Type-Y",
          Description: "Sample Description 2",
          Mfr: "Manufacturer-2",
          "Mfr. Part No": "MFR456",
          Till: "2023-12-20",
        },
        // Add more rows as needed
      ],
      colDefs: [
        {
          field: "id", // Added "id" field
          hide: true,
        },
        {
          field: "level",
          headerCheckboxSelection: true,
          checkboxSelection: true,
        },
        { field: "VEPL Part No" },
        { field: "Priority Level" },
        { field: "Value" },
        { field: "PCB Footprint" },
        { field: "Type" },
        { field: "Description" },
        { field: "Mfr" },
        { field: "Mfr. Part No" },
        { field: "Till" },
        {
          headerName: "Actions",
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
  mounted() {
    // Uncomment and modify the fetchData method based on your API endpoint
    // this.fetchData();
  },
  methods: {
    // Uncomment and modify the fetchData method based on your API endpoint
    // async fetchData() {
    //   const response = await fetch("Your API Endpoint");
    //   this.rowData = await response.json();
    // },

    onRowClicked(params) {
      this.$emit("rowClicked", params.data);
    },
    onRowSelected(params) {
      if (params.node.isSelected()) {
        this.$emit("rowSelected", params.node.data);
      }
    },
    //   editButtonRenderer(params) {
    //     const button = document.createElement("button");
    //     button.innerHTML = `<i class="fas fa-edit"></i>`;
    //     button.classList.add("btn", "btn-primary");

    //     button.addEventListener("click", () => this.onEditClick(params.data.id));
    //     return button;
    //   },
    //   onEditClick(id) {
    //     this.$router.push(`/bomItemDetails/edit/${id}`);
    //   },
  },
};
</script>

<style scoped></style>
