<template>
  <v-container class="fill-height">
    <v-row
      v-if="!connected"
      class="fill-height"
      justify="center"
      align="center"
    >
      <v-col class="text-center">
        <div class="my-2">
          <v-icon x-large>{{ disconnectIcon }}</v-icon
          ><span class="text-body-1 text-lg-h6"> Connection Lost </span>
        </div>
        <div class="text-caption">Waiting to reconnect...</div>
      </v-col>
    </v-row>
    <v-row
      v-else
      class="text-caption text-md-body-1 fill-height"
      justify="center"
      align-content="center"
    >
      <v-col cols="12">
        <v-row no-gutters justify="center">
          <v-col cols="10" md="6" lg="4" class="text-center">
            <v-img
              :src="require(`@/assets/clublogo.png`)"
              lazy-src="data:image/png;base64,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"
            ></v-img>
          </v-col>
        </v-row>
        <v-row dense justify="center" class="text-caption text-lg-body-1">
          <v-col
            v-if="loading_error"
            cols="10"
            lg="4"
            class="text-center error--text"
          >
            <div>{{ loading_error }}</div>
          </v-col>
          <v-col v-else cols="10" lg="4" class="text-center">
            Initilizing ...
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiLanDisconnect, mdiCheckOutline, mdiAlertCircle } from "@mdi/js";

export default {
  data() {
    return {
      disconnectIcon: mdiLanDisconnect,
      checkOutlineIcon: mdiCheckOutline,
      alertIcon: mdiAlertCircle,
    };
  },
  computed: {
    connected: function () {
      return this.$store.state.connected;
    },
    loading_error: function () {
      return this.$store.state.loading_error;
    },
  },
};
</script>

<style scoped>
@keyframes flickerAnimation {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.animate-flicker {
  animation: flickerAnimation 1s infinite;
}
</style>
