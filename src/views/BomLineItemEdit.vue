<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h2 class="mb-4">Edit/Delete BOM Line Item</h2>

        <!-- Display BOM fields within sections -->
        <section>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="veplPartNumber">VEPL Part Number</label>
                <input
                  v-model="editedBom.part_number"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="level">Level</label>
                <input
                  v-model="editedBom.level"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="priorityLevel">Priority Level</label>
                <input
                  v-model="editedBom.priority_level"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <!-- Add other fields in a similar fashion -->

          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="value">Value</label>
                <input
                  v-model="editedBom.value"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="pcbFootprint">PCB Footprint</label>
                <input
                  v-model="editedBom.pcb_footprint"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="lineItemType">Type</label>
                <select v-model="editedBom.line_item_type" class="form-control">
                  <option
                    v-for="type in line_item_types"
                    :key="type.id"
                    :value="type"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <input
              v-model="editedBom.description"
              type="text"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="references">References</label>
            <input
              :value="getReferences(editedBom.references)"
              type="text"
              class="form-control"
              disabled
            />
          </div>

          <div class="form-group">
            <label for="manufacturerParts">Manufacturer Parts</label>
            <input
              :value="getManufacturerParts(editedBom.manufacturer_parts)"
              type="text"
              class="form-control"
              disabled
            />
          </div>

          <div class="form-group">
            <label for="customerPartNumber">Customer Part Number</label>
            <input
              v-model="editedBom.customer_part_number"
              type="text"
              class="form-control"
            />
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="quantity">Quantity</label>
                <input
                  v-model="editedBom.quantity"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="uom">UOM</label>
                <input
                  v-model="editedBom.uom"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="assemblyStage">Assembly Stage</label>
            <input
              v-model="editedBom.assembly_stage.name"
              type="text"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="ecn">ECN</label>
            <input v-model="editedBom.ecn" type="text" class="form-control" />
          </div>

          <div class="form-group">
            <label for="msl">MSL</label>
            <input v-model="editedBom.msl" type="text" class="form-control" />
          </div>

          <div class="form-group">
            <label for="remarks">Remarks</label>
            <input
              v-model="editedBom.remarks"
              type="text"
              class="form-control"
            />
          </div>
        </section>

        <!-- Buttons for Save Changes and Delete -->
        <section class="mt-4">
          <button @click="submit" class="btn btn-primary mr-2">
            Save Changes
          </button>
          <button @click="confirmDelete" class="btn btn-danger">
            Delete BOM Line Item
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      editedBom: {
        part_number: "",
        level: "",
        priority_level: "",
        value: "",
        pcb_footprint: "",
        line_item_type: {},
        description: "",
        references: [],
        manufacturer_parts: [],
        customer_part_number: "",
        quantity: "",
        uom: "",
        assembly_stage: { name: "" },
        ecn: "",
        msl: "",
        remarks: "",
      },
      line_item_types: [],
    };
  },
  methods: {
    async fetchDataFromAPI() {
      try {
        // Fetch BOM details
        const response = await axios.get(
          `store/get-line-items/${this.$route.params.id}`
        );
        console.log("API response for line items", response.data);
        this.editedBom = response.data;
        console.log("this is edit bom", this.editedBom);

        this.line_item_types = typesResponse.data;
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    },

    submit() {
      console.log(this.editedBom);
    },
    saveChanges() {
      // Implement logic to update BOM line item data using API
      // After successful update, you can show a success message or redirect
    },
    confirmDelete() {
      if (confirm("Are you sure you want to delete this BOM Line Item?")) {
        // Implement logic to delete BOM line item using API
        // After successful deletion, you can show a success message or redirect
      }
    },
    getReferences(references) {
      if (references && references.length > 0) {
        return references.map((reference) => reference.name).join(", ");
      }
      return "";
    },
    getManufacturerParts(manufacturerParts) {
      if (manufacturerParts && manufacturerParts.length > 0) {
        return manufacturerParts
          .map((part) => `${part.part_number} - ${part.manufacturer.name}`)
          .join(", ");
      }
      return "";
    },
  },
  mounted() {
    // Fetch data when the component is mounted
    this.fetchDataFromAPI();
  },
};
</script>

<style scoped>
/* Add your custom styles here */
.form-group {
  margin-bottom: 20px;
}
</style>
