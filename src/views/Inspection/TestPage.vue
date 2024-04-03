<template>
  <div>
    <div>Roll over image to zoom in</div>

    <div id="img-zoomer-box">
      <img src="https://bit.ly/2mgDw0y" class="p" id="img-1" />
      <div id="img-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.zoomer();
  },

  methods: {
    zoomer() {
      console.log("called");
      const imageBox = document.querySelector("#img-zoomer-box");
      const original = document.querySelector("#img-1");
      const magnified = document.querySelector("#img-2");

      const handleMouseMoves = (e) => {
        const style = magnified.style;
        const x = e.pageX - imageBox.offsetLeft; // Use imageBox.offsetLeft instead of this.offsetLeft
        const y = e.pageY - imageBox.offsetTop;
        const imgWidth = original.offsetWidth;
        const imgHeight = original.offsetHeight;
        let xperc = (x / imgWidth) * 100;
        let yperc = (y / imgHeight) * 100;

        //lets user scroll past right edge of image
        if (x >= 0.01 * imgWidth) {
          xperc *= 1.15;
        }

        //lets user scroll past bottom edge of image
        if (y >= 0.01 * imgHeight) {
          yperc *= 1.15;
        }

        style.backgroundPositionX = `${xperc - 9}%`;
        style.backgroundPositionY = `${yperc - 9}%`;
        style.left = `${x - 180}px`;
        style.top = `${y - 180}px`;
      };

      imageBox.addEventListener("mousemove", handleMouseMoves);
    },
  },
};
</script>

<style lang="scss" scoped>
#img-zoomer-box {
  width: 500px;
  height: auto;
  position: relative;
  margin: 0 auto; /* Center the container horizontally */
  margin-top: 200px;
}

#img-1 {
  width: 100%;
  height: auto;
}

#img-zoomer-box:hover,
#img-zoomer-box:active {
  cursor: zoom-in;
  display: block;
}

#img-zoomer-box:hover #img-2,
#img-zoomer-box:active #img-2 {
  opacity: 1;
}
#img-2 {
  width: 340px;
  height: 340px;
  background: url("https://bit.ly/2mgDw0y") no-repeat #fff;
  box-shadow: 0 5px 10px -2px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  position: absolute;
  opacity: 0;
  border: 4px solid whitesmoke;
  z-index: 99;
  border-radius: 100%;
  display: block;
  transition: opacity 0.2s;
}
</style>
