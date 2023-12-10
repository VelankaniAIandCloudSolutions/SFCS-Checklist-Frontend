<template>
  <div>
    <ag-grid-vue
      style="height: 500px"
      class="ag-theme-quartz"
      :rowData="bom"
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
    // id: {
    //   type: Number,
    //   required: true,
    // },
    bom: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // rowData: this.bom || [],
      colDefs: [
        //   {
        //     field: "id", // Added "id" field
        //     hide: true,
        //   },
        //   {
        //     field: "level",
        //     headerCheckboxSelection: true,
        //     checkboxSelection: true,
        //   },
        //   { field: "VEPL Part No" },
        //   { field: "Priority Level" },
        //   { field: "Value" },
        //   { field: "PCB Footprint" },
        //   { field: "Type" },
        //   { field: "Description" },
        //   { field: "Mfr" },
        //   { field: "Mfr. Part No" },
        //   { field: "Till" },
        //   {
        //     headerName: "Actions",
        //     cellRenderer: this.editButtonRenderer,
        //   },
        // ],
        { headerName: "ID", field: "id", hide: true },
        { headerName: " Level", field: "level" },
        { headerName: "VEPL Part Number", field: "part_number" },
        { headerName: "Priority Level", field: "priority_level" },

        { headerName: "Value", field: "value" },
        { headerName: "PCB Footprint", field: "pcb_footprint" },
        { headerName: "Type", field: "line_item_type.name" },

        { headerName: "Description", field: "description" },
        {
          headerName: "Manufacturer",
          valueGetter: function (params) {
            const manufacturerParts = params.data.manufacturer_parts;
            if (manufacturerParts && manufacturerParts.length > 0) {
              const manufacturer = manufacturerParts[0].manufacturer;
              if (manufacturer) {
                // Concatenate name and part_number with a hyphen in between
                return `${manufacturer.name} - ${manufacturerParts[0].part_number}`;
              }
            }
            return ""; // Return an empty string if data is missing
          },
        },
        { headerName: "Customer Part Number", field: "customer_part_number" },
        { headerName: "Quantity", field: "quantity" },
        { headerName: "UOM", field: "uom" },
        { headerName: "Assembly Stage", field: "assembly_stage.name" },

        { headerName: "ECN", field: "ecn" },
        { headerName: "MSL", field: "msl" },
        { headerName: "Remarks", field: "remarks" },

        // { headerName: "Updated At", field: "updated_at" },
        // { headerName: "BOM ID", field: "bom" },
        // { headerName: "Product ID", field: "product.id" },
        // { headerName: "Product Name", field: "product.name" },
        // { headerName: "Product Code", field: "product.product_code" },
        // {
        //   headerName: "Product Rev Number",
        //   field: "product.product_rev_number",
        // },
        // { headerName: "Issue Date", field: "issue_date" },
        // { headerName: "Total Line Items", field: "total_line_items" },
        // { headerName: "Total SMT Locations", field: "total_smt_locations" },
        // { headerName: "Total PTH Locations", field: "total_pth_locations" },
        // { headerName: "BOM Rev Number", field: "bom_rev_number" },
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
