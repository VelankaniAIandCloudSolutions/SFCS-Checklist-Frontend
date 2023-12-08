<template>
  <div class="container">
    <div class="row align-items-center mb-4">
      <div class="col-md-6 d-flex align-items-center">
        <h2 class="mb-0">Checklist</h2>
        <span class="ms-3 fs-4 text-muted">|</span>
        <nav aria-label="breadcrumb" class="ms-3">
          <ol class="breadcrumb bg-transparent mb-0 p-0">
            <li class="breadcrumb-item"><a href="#">Home</a></li>

            <li class="breadcrumb-item"><a href="#">Category</a></li>

            <li class="breadcrumb-item active" aria-current="page">
              Current Page
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <div class="card border-primary mb-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Active Bom Details</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col">
            <strong>Part Name:</strong> {{ activeBom.partName }}
          </div>
          <div class="col">
            <strong>Product Code:</strong> {{ activeBom.productCode }}
          </div>
          <div class="col">
            <strong>BOM Rev No:</strong> {{ activeBom.bomRevNo }}
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
            BOM Check
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-headingOne"
        >
          <div class="accordion-body">
            <CheckListTable :checklistItems="checklistItems" />
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
            Solder Paste Check
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="panelsStayOpen-headingTwo"
        >
          <div class="accordion-body">
            <strong>This is the second item's accordion body.</strong> It is
            hidden by default, until the collapse plugin adds the appropriate
            classes that we use to style each element. These classes control the
            overall appearance, as well as the showing and hiding via CSS
            transitions. You can modify any of this with custom CSS or
            overriding our default variables. It's also worth noting that just
            about any HTML can go within the <code>.accordion-body</code>,
            though the transition does limit overflow.
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
      activeBom: {
        partName: "PRYSM-Zen-2",
        productCode: "12121",
        bomRevNo: "2121",
        // Add more properties as needed
      },
      checklist: "",
      checklistItems: [],
    };
  },
  mounted() {
    this.getChecklist();
    // this.pollingInterval = setInterval(() => {
    //   this.getChecklist();
    // }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.pollingInterval);
  },
  methods: {
    async getChecklist() {
      this.$store.commit("setIsLoading", true);
      console.log("work");
      this.$store.commit("setIsLoading", false);
      await axios
        .get(`store/get-active-checklist/${this.$route.params.id}/`)
        .then((response) => {
          console.log(response.data);
          this.checklist = response.data.checklist;
          this.checklistItems = this.checklist.checklist_items;
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
  },
};
</script>

<style lang="scss" scoped>
/* Add your custom styles if needed */
</style>
