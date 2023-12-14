<template>
  <div class="container">
    <div class="row align-items-center">
      <!-- Heading and Breadcrumb Column -->
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Checklist Details</h2>
          <span class="ms-3 fs-4 text-muted me-3">|</span>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb bg-transparent m-0 p-0 justify-content-end">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">
                Checklist
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div class="col-md-6 mt-4 d-flex justify-content-end">
        <div class="container">
          <div class="d-flex justify-content-end">
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#generateLabelModal"
              class="btn btn-success me-2"
            >
              Generate Label
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="generateLabelModal"
      tabindex="-1"
      aria-labelledby="generateLabelModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="generateLabelModalLabel">
              Generate Label
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            You can only generate a label if all checks are passed
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              v-if="isChecklistPassed"
              type="button"
              class="btn btn-success"
              data-bs-dismiss="modal"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-primary mb-4 mt-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">BOM Details</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div v-if="activeBom.product" class="col">
            <strong>Product Name:</strong> {{ activeBom.product.name }}
          </div>
          <div v-if="activeBom.product" class="col">
            <strong>Product Code:</strong> {{ activeBom.product.product_code }}
          </div>
          <div class="col">
            <strong>BOM Rev No:</strong> {{ activeBom.bom_rev_number }}
          </div>
          <div class="col">
            <strong>Issue Date:</strong> {{ activeBom.issue_date }}
          </div>
        </div>
      </div>
    </div>
    <div class="accordion" id="accordionPanelsStayOpenExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseOne"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
            Raw Material Check
            <div v-if="isRawMaterialSufficient == false">
              <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-headingOne"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Raw Material']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseTwo"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseTwo"
          >
            PCB Check
            <div v-if="isPcbSufficient == false">
              <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingTwo"
        >
          <div class="accordion-body">
            <CheckListTable :checklistItems="filteredChecklistItems['PCB']" />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingThree">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseThree"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseThree"
          >
            Solder Paste
            <div v-if="isSolderPasteSufficient == false">
              <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseThree"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingThree"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Solder Paste']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingFour">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseFour"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseFour"
          >
            Solder Bar
            <div v-if="isSolderBarSufficient == false">
              <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseFour"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingFour"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Solder Bar']"
            />>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingFive">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseFive"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseFive"
          >
            Flex
            <div v-if="isFlexSufficient == false">
              <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseFive"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingFive"
        >
          <div class="accordion-body">
            <CheckListTable :checklistItems="filteredChecklistItems['Flex']" />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingSix">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseSix"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseSix"
          >
            IP
            <div v-if="isIpSufficient == false">
              <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseSix"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingSix"
        >
          <div class="accordion-body">
            <CheckListTable :checklistItems="filteredChecklistItems['IP']" />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingSeven">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseSeven"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseSeven"
          >
            Stencils
            <div v-if="isStencilsSufficient == false">
              <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseSeven"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingSeven"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Stencils']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingEight">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseEight"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseEight"
          >
            Reflow Pallet
            <div v-if="isReflowPalletSufficient == false">
              <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseEight"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingEight"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Reflow Pallet']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingNine">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseNine"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseNine"
          >
            Wave Pallet
            <div v-if="isWavePalletSufficient == false">
              <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseNine"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingNine"
        >
          <div class="accordion-body">
            <CheckListTable
              :checklistItems="filteredChecklistItems['Wave Pallet']"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingTen">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseTen"
            aria-expanded="false"
            aria-controls="panelsStayOpen-collapseTen"
          >
            Label
            <div v-if="isLabelSufficient == false">
              <i class="bi bi-x-circle-fill fs-4 ms-2"></i>
            </div>
            <div v-else>
              <i class="bi bi-check-circle-fill fs-4 ms-2"></i>
            </div>
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseTen"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingTen"
        >
          <div class="accordion-body">
            <CheckListTable :checklistItems="filteredChecklistItems['Label']" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckListTable from "../components/CheckListTable"; // Adjust the path based on your actual file structure
import axios from "axios";
export default {
  components: {
    CheckListTable,
  },
  data() {
    return {
      activeBom: "",
      checklist: "",
      checklistItems: [],
      isRawMaterialSufficient: false,
      isPcbSufficient: false,
      isSolderPasteSufficient: false,
      isSolderBarSufficient: false,
      isFlexSufficient: false,
      isIpSufficient: false,
      isStencilsSufficient: false,
      isReflowPalletSufficient: false,
      isWavePalletSufficient: false,
      isLabelSufficient: false,
      isChecklistPassed: false,
      isChecklistEnded: false,
      pollingInterval: "",
      filteredChecklistItems: {
        "Raw Material": [],
        PCB: [],
        "Solder Paste": [],
        "Solder Bar": [],
        Flex: [],
        Ip: [],
        Stencils: [],
        "Reflow Pallet": [],
        "Wave Pallet": [],
        Label: [],
        // Initialize other types as needed
      },
    };
  },
  mounted() {
    this.getChecklist();
  },
  methods: {
    async getChecklist() {
      this.$store.commit("setIsLoading", true);
      this.$store.commit("setIsLoading", false);
      await axios
        .get(`store/get-checklist-details/${this.$route.params.id}/`)
        .then((response) => {
          console.log("yehh", response.data);
          this.checklist = response.data.checklist;
          this.checklistItems = this.checklist.checklist_items;
          console.log("chehcklist items hereeeeee", this.checklistItems);
          console.log("chehcklist items hereeeeee", this.checklistItems);
          const rawMaterialItems =
            this.filterChecklistItemsByType("Raw Material");

          console.log(rawMaterialItems);

          const pcbItems = this.filterChecklistItemsByType("PCB");
          const solderPasteItems =
            this.filterChecklistItemsByType("Solder Paste");
          const solderBarItems = this.filterChecklistItemsByType("Solder Bar");
          const flexItems = this.filterChecklistItemsByType("Flex");
          const IpItems = this.filterChecklistItemsByType("IP");
          const stencilItems = this.filterChecklistItemsByType("Stencils");
          const reflowPalletItems =
            this.filterChecklistItemsByType("Reflow Pallet");
          const wavePalletItems =
            this.filterChecklistItemsByType("Wave Pallet");
          const labelItems = this.filterChecklistItemsByType("Label");

          this.isChecklistPassed = this.checklist.is_passed;
          this.activeBom = this.checklist.bom;
          this.filteredChecklistItems = {
            "Raw Material": rawMaterialItems,
            PCB: pcbItems,
            "Solder Paste": solderPasteItems,
            "Solder Bar": solderBarItems,
            Flex: flexItems,
            IP: IpItems,
            Stencils: stencilItems,
            "Reflow Pallet": reflowPalletItems,
            "Wave Pallet": wavePalletItems,
            Label: labelItems,
            // Add more types                                                                                                                    as needed
          };
          console.log("filered checklsit items", this.filteredChecklistItems);
          this.isRawMaterialSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Raw Material"
          );

          this.isPcbSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "PCB"
          );
          this.isSolderPasteSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Solder Paste"
          );
          this.isSolderBarSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Solder Bar"
          );
          console.log("checking solder bar", this.isSolderBarSufficient);
          this.isFlexSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Flex"
          );
          this.isIpSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "IP"
          );
          this.isStencilsSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Stencils"
          );
          this.isReflowPalletSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Reflow Pallet"
          );
          this.isWavePalletSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Wave Pallet"
          );
          this.isLabelSufficient = this.isItemsSufficient(
            this.filteredChecklistItems,
            "Label"
          );

          this.isChecklistPassed = this.checklist.is_passed;
          this.activeBom = this.checklist.bom;
          if (
            this.checklist.status == "Completed" ||
            this.checklist.status == "Failed"
          ) {
            this.isChecklistEnded = true;
          }
          this.$store.commit("setIsLoading", false);
        })
        .catch((error) => {
          console.log("error:", error);
          this.$notify({
            title: "An error occured, please try again later",
            type: "bg-danger-subtle text-danger",
            duration: "5000",
          });
          this.$store.commit("setIsLoading", false);
        });
    },
    filterChecklistItemsByType(type) {
      return this.checklistItems.filter((item) => {
        const itemType = item.checklist_item_type;

        // Check if checklist_item_type is not null and has a name property
        if (itemType && itemType.name) {
          return itemType.name.toLowerCase() === type.toLowerCase();
        }

        // Return false if checklist_item_type is null or has no name property
        return false;
      });
    },
    isItemsSufficient(checklistItems, type) {
      const typeItems = this.filteredChecklistItems[type];
      // Check if there are no items of the specified type
      if (typeItems.length === 0) {
        return false;
      }

      // Check if all items have sufficient quantity
      const sufficientItems = typeItems.filter((item) => {
        // Assuming 'is_quantity_sufficient' is a property indicating if the quantity is sufficient
        return item.is_quantity_sufficient === true;
      });

      return sufficientItems.length === typeItems.length;
    },
  },
};
</script>

<style lang="scss" scoped>
/* Add your custom styles if needed */
</style>
