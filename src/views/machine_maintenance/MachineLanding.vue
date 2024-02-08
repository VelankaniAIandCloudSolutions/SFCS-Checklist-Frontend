<template>
  <div>
    <button @click="redirectToMaintenanceCalendar">Create Maintenance</button>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToMaintenanceCalendar() {
      // Navigate to the "/CreateMachineMaintenanceCalendar" page
      this.$router.push("/machine/create-maintenance-calendar");
    },
  },
};
</script>

<style lang="scss" scoped></style>
