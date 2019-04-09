<template>
  <div id="app" :class="clsPrefix">
    <h1> Test enviroment for selenium-unittest</h1>
    <test-block title="All tests" name="all">
      <ul>
        <li> <p class="test-title"> Test keyboard: <test-button name="stretch" :running="false"/> </p> </li>
      </ul>
    </test-block>
    <test-block title="Test keyboard" name="keyboard print" id="keyboard-print-id">
      <div> <input v-model="values[0]" placeholder="value0"/> </div>
      <div> <input v-model="values[1]" placeholder="value1"/> </div>
      <div> <input v-model="values[2]" placeholder="value2"/> </div>
      <div> <input v-model="values[3]" placeholder="value3"/> </div>
    </test-block>
  </div>
</template>

<script>
const clsPrefix = 'vue-selenium-unittest'

export default {
  name: 'app',
  data () {
    return {
      clsPrefix,
      values: [...Array(10).keys()].map(_ => ''),
    }
  }
}
</script>

<style lang="scss">
$pre: vue-selenium-unittest;
.#{$pre} h1 {
  text-align: center;
}
.test-title {
  font-weight: bolder;
}
input {
  width: 600px;
}

</style>
