<template>
  <div v-if="$store.state.isLoading" class="container text-center">
    <div
      class="spinner-border mt-5"
      style="width: 4rem; height: 4rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div>
      <b> Loading... </b>
    </div>
  </div>
  <div v-else class="container">
    <div class="row align-items-center">
      <div class="col-md-6 mt-4">
        <div class="d-flex align-items-center">
          <h2 class="mb-0">Part Pricing Search</h2>
          <span class="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" class="d-inline-block ms-3">
            <ol class="breadcrumb bg-transparent m-0 p-0">
              <li class="breadcrumb-item">
                <router-link to="/"
                  ><i class="fas fa-home me-1"></i> Home</router-link
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-search me-1"></i>
                Search Part
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

    <!-- <div class="card p-3 mb-4 mt-4"> -->
    <nav style="margin-top: 2%">
      <div
        class="nav nav-tabs d-flex align-items-center center-tabs"
        id="nav-tab"
        role="tablist"
      >
        <button
          :class="['nav-link', { active: activeTab === 'home' }]"
          id="nav-home-tab"
          @click="activeTab = 'home'"
          data-bs-toggle="tab"
          data-bs-target="#nav-home"
          type="button"
          role="tab"
          aria-controls="nav-home"
          :aria-selected="activeTab === 'home'"
          style="margin-left: 25%"
        >
          Searh By Manufacturer Part Number
        </button>
        <button
          :class="['nav-link', { active: activeTab === 'profile' }]"
          id="nav-profile-tab"
          data-bs-toggle="tab"
          @click="activeTab = 'profile'"
          data-bs-target="#nav-profile"
          type="button"
          role="tab"
          aria-controls="nav-profile"
          :aria-selected="activeTab === 'profile'"
        >
          Searh By VEPL Number
        </button>
      </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
      <div
        c
        :class="['tab-pane fade', { 'show active': activeTab === 'home' }]"
        id="nav-home"
        role="tabpanel"
        aria-labelledby="nav-home-tab"
        tabindex="0"
      >
        <section class="card p-3" style="margin-top: 2%">
          <div class="row mb-3 align-items-end">
            <div class="col-md-8">
              <label for="partNumberInput" class="form-label"
                >Enter Manufacturer Part Number to Search</label
              >
              <input
                type="text"
                id="partNumberInput"
                v-model="manufacturerPartNumber"
                class="form-control"
                placeholder="Enter part number"
              />
            </div>
            <div class="col-md-4 text-end">
              <button class="btn btn-primary" @click="fetchProductPrices">
                Fetch Prices
              </button>
            </div>
          </div>
        </section>
        <div class="container" v-if="showPricingTable">
          <PricingSearchTable
            :pricingdetails="pricingdetails"
            @recommendation_details="handleRecommendationDetails"
          />
        </div>
      </div>
      <div
        :class="['tab-pane fade', { 'show active': activeTab === 'profile' }]"
        id="nav-profile"
        role="tabpanel"
        aria-labelledby="nav-profile-tab"
        tabindex="0"
      >
        <section class="card p-3" style="margin-top: 2%">
          <div class="row mb-3 align-items-end">
            <div class="col-md-8">
              <label for="partNumberInput" class="form-label"
                >Enter VEPL Number to Search</label
              >
              <input
                type="text"
                id="partNumberInput"
                v-model="veplNumber"
                class="form-control"
                placeholder="Enter VEPL number"
              />
            </div>
            <div class="col-md-4 text-end">
              <button class="btn btn-primary" @click="fetchVeplPrices">
                Fetch Prices
              </button>
            </div>
          </div>
        </section>
        <div class="container" v-if="showVEPLPricingTable">
          <PricingSearchTable
            :veplNumber_prices="veplNumber_prices"
            @recommendation_details="handleRecommendationDetails"
          />
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import axios from "axios";
// import PartPricingTable from "@/components/PartPricingTable.vue";
import PricingSearchTable from "@/components/PricingSearchTable.vue";

export default {
  components: { PricingSearchTable },

  data() {
    return {
      manufacturerPartNumber: "",
      veplNumber: "",
      activeTab: "home",

      pricingdetails: [],
      veplNumber_prices: [],
      recommendation_details: [],
      showPricingTable: false,
      showVEPLPricingTable: false,
    };
  },

  mounted() {
    console.log(" Emitted data ", this.recommendation_details);
  },

  methods: {
    fetchProductPrices() {
      if (!this.manufacturerPartNumber) {
        alert("Please enter a manufacturer part number");
        return;
      }

      this.$store.commit("setIsLoading", true);

      axios
        .get(`/pricing/get-pricing-details`, {
          params: {
            part_number: this.manufacturerPartNumber,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.pricingdetails = response.data.final_json;

          this.showPricingTable = true;
          // Handle the response data as needed
        })
        .catch((error) => {
          console.error("Error fetching product prices:", error);
          // Handle the error as needed
        })
        .finally(() => {
          this.$store.commit("setIsLoading", false);
        });
    },

    async fetchVeplPrices() {
      if (!this.veplNumber) {
        alert("Please enter a VEPL part number");
        return;
      }

      this.$store.commit("setIsLoading", true);

      await axios
        .get(`/pricing/get-VEPLNumber-pricing-details`, {
          params: {
            part_number: this.veplNumber,
          },
        })
        .then((response) => {
          console.log("Fetched VEPL Number Prices", response.data);

          this.veplNumber_prices = response.data.final_json;
          this.showVEPLPricingTable = true;
        })
        .catch((error) => {
          console.log(error);
        });

      this.$store.commit("setIsLoading", false);
    },
    handleRecommendationDetails(details) {
      console.log("emit handle ");
      console.log(" the Details", details);
      this.recommendation_details = details;
    },
  },

  watch: {
    // Watch recommendation_details for changes
    recommendation_details(newVal) {
      console.log("Recommendation details updated:", newVal);
      // You can perform additional actions here when recommendation_details changes
    },
  },
};
</script>

<style lang="scss" scoped></style>
