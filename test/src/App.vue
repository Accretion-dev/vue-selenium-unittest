<template>
  <div id="app" :class="clsPrefix">
    <h1> Test enviroment for selenium-unittest</h1>
    <test-env>
      <test-block title="All tests" name="all">
        <ul>
          <li> <p class="test-title"> Test keyboard: <test-button name="keyboard"/> </p> </li>
          <li> <p class="test-title"> Test mouse: <test-button name="mouse"/> </p> </li>
          <li> <p class="test-title"> Test mouse-smooth: <test-button name="mouse-smooth"/> </p> </li>
        </ul>
      </test-block>
      <test-block title="Test keyboard" name="keyboard" id="keyboard-id">
        <div> <input v-model="values[0]" placeholder="value0"/> </div>
        <div> <input v-model="values[1]" placeholder="value1"/> </div>
        <div> <input v-model="values[2]" placeholder="value2"/> </div>
        <div> <input v-model="values[3]" placeholder="value3"/> </div>
      </test-block>
      <test-block title="Test mouse" name="mouse" id="mouse-id">
        <div>
          <button class="iview-button" name="0" @click="countP" @contextmenu.prevent="countM"> {{ buttonClicks[0] }} </button>
          <button class="iview-button" name="1" @click="countP" @contextmenu.prevent="countM"> {{ buttonClicks[1] }} </button>
          <button class="iview-button" name="2" @click="countP" @contextmenu.prevent="countM"> {{ buttonClicks[2] }} </button>
          <button class="iview-button" name="3" @click="countP" @contextmenu.prevent="countM"> {{ buttonClicks[3] }} </button>
        </div>
        <div>
          <ColorPicker id="color-picker" v-model="color"/>
        </div>
        <div style="height: 50px">
          <Split v-model="split">
            <div slot="left" class="demo-split-pane">
              Left Pane
            </div>
            <div slot="right" class="demo-split-pane">
              Right Pane
            </div>
          </Split>
        </div>
        <div>
          <Dropdown id="drop-hover">
            <a href="javascript:void(0)">
              hover 触发
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>驴打滚</DropdownItem>
              <DropdownItem>炸酱面</DropdownItem>
              <DropdownItem>豆汁儿</DropdownItem>
              <DropdownItem>冰糖葫芦</DropdownItem>
              <DropdownItem>北京烤鸭</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown id="drop-click" trigger="click" style="margin-left: 20px">
            <a href="javascript:void(0)">
              click 触发
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>驴打滚</DropdownItem>
              <DropdownItem>炸酱面</DropdownItem>
              <DropdownItem>豆汁儿</DropdownItem>
              <DropdownItem>冰糖葫芦</DropdownItem>
              <DropdownItem>北京烤鸭</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown id="drop-rclick" trigger="contextMenu" style="margin-left: 20px">
            <a href="javascript:void(0)">
              right click
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>返回</DropdownItem>
              <DropdownItem style="color: #ed4014">删除</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div>
          <drag-test/>
        </div>
      </test-block>
      <test-block title="Test mouse smooth move" name="mouse-smooth" id="mouse-smooth-id">
        <div>
          <drawing-board-vue board-id="mydrawingboard" height="600px" width="600px" :value="value"></drawing-board-vue>
        </div>
      </test-block>
    </test-env>
  </div>
</template>

<script>
const clsPrefix = 'vue-selenium-unittest'
import dragTest from './components/drag-test.vue'
import { DrawingBoardVue } from 'vue-drawingboard'

export default {
  name: 'app',
  components: {dragTest, DrawingBoardVue},
  data () {
    return {
      clsPrefix,
      values: [...Array(10).keys()].map(_ => ''),
      buttonClicks: [...Array(10).keys()].map(_ => 0),
      split: 0.5,
      collapse: [],
      color: '',
      value: '',
    }
  },
  methods: {
    countP (event) {
      let name = Number(event.target.getAttribute('name'))
      this.$set(this.buttonClicks, name, this.buttonClicks[name] + 1)
    },
    countM (event) {
      let name = Number(event.target.getAttribute('name'))
      this.$set(this.buttonClicks, name, this.buttonClicks[name] - 1)
    },
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
.iview-button {
  padding: 3px;
  margin: 5px;
}
</style>
