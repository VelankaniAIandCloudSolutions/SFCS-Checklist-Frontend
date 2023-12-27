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
                    :value="type.id"
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

          <!-- <div class="form-group">
            <label for="references">References</label>
            <input
              :value="getReferences(editedBom.references)"
              type="text"
              class="form-control"
              disabled
            />
          </div> -->
          <div class="form-group">
            <label for="references">References</label>
            <div>
              <div
                v-for="reference in editedBom.references"
                :key="reference.id"
                class="tag"
              >
                {{ reference.name }}
                <span @click="removeReference(reference)" class="remove-tag"
                  >X</span
                >
              </div>
            </div>
            <input
              v-model="newReference"
              @keyup.enter="addNewReference"
              type="text"
              placeholder="Type to add a new reference"
              class="form-control mt-2"
            />
          </div>

          <div class="form-group">
            <label for="manufacturerParts">Manufacturer Parts</label>
            <br />

            <!-- <input
              :value="getManufacturerParts(editedBom.manufacturer_parts)"
              type="text"
              class="form-control"
              disabled
            /> -->
            <div>
              <div
                v-for="part in editedBom.manufacturer_parts"
                :key="part.id"
                class="tag"
              >
                {{ part.part_number }} - {{ part.manufacturer.name }}
              </div>
            </div>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Click here to see
            </button>
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

          <!-- <div class="form-group">
            <label for="assemblyStage">Assembly Stage</label>
            <input
              v-model="editedBom.assembly_stage.name"
              type="text"
              class="form-control"
            />
          </div> -->

          <div class="form-group">
            <label for="assemblyStage">Assembly Stage</label>
            <select v-model="editedBom.assembly_stage" class="form-control">
              <option
                v-for="type in assembly_stages"
                :key="type.id"
                :value="type.id"
              >
                {{ type.name }}
              </option>
            </select>
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
          <button @click="saveChanges" class="btn btn-primary mr-2">
            Save Changes
          </button>
          <button @click="confirmDelete" class="btn btn-danger">
            Delete BOM Line Item
          </button>
        </section>
      </div>
    </div>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Select the Manufacturer Parts
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <manufacturer-parts-grid
              :manufacturerParts="manufacturerParts"
              :selectedManufacturerParts="editedBom.manufacturer_parts"
              @update:selectedManufacturerParts="updateManufacturerParts"
            ></manufacturer-parts-grid>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ManufacturerPartsGrid from "../components/ManufacturerPartsGrid.vue";

export default {
  data() {
    return {
      editedBom: {
        part_number: "",
        level: "",
        priority_level: "",
        value: "",
        pcb_footprint: "",
        line_item_type: "",
        description: "",
        references: [],
        manufacturer_parts: [],
        customer_part_number: "",
        quantity: "",
        uom: "",
        assembly_stage: "",
        ecn: "",
        msl: "",
        remarks: "",
      },
      line_item_types: [],
      newReference: "",
      message: "",
      manufacturerParts: [],
      assembly_stages: [],
    };
  },
  components: {
    "manufacturer-parts-grid": ManufacturerPartsGrid,
  },
  methods: {
    async fetchDataFromAPI() {
      try {
        // Fetch BOM details
        const response = await axios.get(
          `store/edit-bom-line-item/${this.$route.params.id}/`
        );
        console.log(" Main API response for line items", response.data);
        this.editedBom = response.data.bom_line_item;
        this.line_item_types = response.data.line_item_types;
        this.manufacturerParts = response.data.manufacturers_parts;
        this.assembly_stages = response.data.assembly_stages;

        console.log("line_item_types", this.line_item_types);
        // Set the default value for line_item_type
        if (this.line_item_types.length > 0) {
          this.editedBom.line_item_type =
            response.data.bom_line_item.line_item_type.id;
        }
        if (this.assembly_stages.length > 0) {
          this.editedBom.assembly_stage =
            response.data.bom_line_item.assembly_stage.id;
        }
        // this.editedBom.part_number = response.data.bom_line_item.part_number;

        console.log("this is edit bom", this.editedBom);

        // this.line_item_types = typesResponse.data;
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    },
    addNewReference() {
      if (this.newReference.trim() !== "") {
        // Check if the tag already exists
        if (!this.isReferenceExists(this.newReference.trim())) {
          const newReferenceObject = {
            name: this.newReference.trim(),
          };
          this.editedBom.references.push(newReferenceObject);
        }
        this.newReference = ""; // Clear the input after adding
      }
    },

    isReferenceExists(newReference) {
      // Check if the tag already exists in the array
      return this.editedBom.references.some(
        (reference) =>
          reference.name.toLowerCase() === newReference.toLowerCase()
      );
    },

    removeReference(referenceToRemove) {
      // Remove the selected reference from the array
      this.editedBom.references = this.editedBom.references.filter(
        (reference) => reference !== referenceToRemove
      );
    },

    submit() {
      console.log(this.editedBom);
    },
    async saveChanges() {
      // Make an API call to update the BOM line item
      try {
        // Make an API call to update the BOM line item
        const response = await axios.put(
          `store/edit-bom-line-item/${this.$route.params.id}/`,
          this.editedBom
        );
        console.log(response.data);

        // Show success notification
        this.$notify({
          title: "Success",
          text: "BOM Line Item successfully edited",
          type: "success",
        });

        // Reload the page
        this.$router.go();
      } catch (error) {
        console.error("Error updating BOM line item:", error);

        // Show error notification
        this.$notify({
          title: "Error",
          text: "Failed to edit BOM Line Item",
          type: "error",
        });
      }
    },
    async confirmDelete() {
      if (confirm("Are you sure you want to delete this BOM Line Item?")) {
        try {
          // Make a DELETE request to the delete-bom-line-item endpoint
          const response = await axios.delete(
            `store/delete-bom-line-item/${this.$route.params.id}`
          );

          // Check if the deletion was successful
          if (response.status === 204) {
            // Show a success notification
            this.$notify({
              title: "Success",
              message: "BOM Line Item deleted successfully",
              type: "success",
            });

            // Optionally, you can redirect to another page or reload the current page
            // this.$router.push("/some-other-page");
            location.reload();
          } else {
            // Show an error notification
            this.$notify({
              title: "Error",
              message: "Failed to delete BOM Line Item",
              type: "error",
            });
          }
        } catch (error) {
          console.error("Error deleting BOM Line Item:", error);
          // Show an error notification
          this.$notify({
            title: "Error",
            message: "An error occurred while deleting BOM Line Item",
            type: "error",
          });
        }
      }
    },
    updateManufacturerParts(selectedManufacturerParts) {
      this.editedBom.manufacturer_parts = selectedManufacturerParts;
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
  updateManufacturerParts(selectedManufacturerParts) {
    this.editedBom.manufacturer_parts = selectedManufacturerParts;
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
.tag {
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 5px;
  background-color: #e0e0e0;
  border-radius: 3px;
}

.remove-tag {
  cursor: pointer;
  margin-left: 5px;
  color: red;
}
</style>
