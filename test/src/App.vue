<template>
  <div id="app" :class="clsPrefix">
    <h1> Test enviroment for selenium-unittest</h1>
    <test-env>
      <test-block title="All tests" name="all">
        <ul>
          <li> <p class="test-title"> Test keyboard: <test-button name="keyboard"/> </p> </li>
          <li> <p class="test-title"> Test mouse: <test-button name="mouse"/> </p> </li>
          <li> <p class="test-title"> Test keyboard+mouse: <test-button name="keyboard+mouse"/> </p> </li>
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
          <Collapse v-model="collapse" accordion>
            <Panel name="1">
              史蒂夫·乔布斯
              <p slot="content">史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
            </Panel>
            <Panel name="2">
              斯蒂夫·盖瑞·沃兹尼亚克
              <p slot="content">斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
            </Panel>
          </Collapse>
        </div>
        <div>
          <Dropdown>
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
          <Dropdown trigger="click" style="margin-left: 20px">
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
          <Dropdown trigger="contextMenu" style="margin-left: 20px">
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
          <Cascader :data="selectDatas" v-model="selectData"></Cascader>
        </div>
        <div>
          <ColorPicker v-model="color" />
        </div>
        <div>
          <drag-test/>
        </div>
      </test-block>
      <test-block title="Test key+mouse" name="keyboard+mouse" id="keyboard-mouse-id">
      </test-block>
    </test-env>
  </div>
</template>

<script>
const clsPrefix = 'vue-selenium-unittest'
import dragTest from './components/drag-test.vue'

export default {
  name: 'app',
  components: {dragTest},
  data () {
    return {
      clsPrefix,
      values: [...Array(10).keys()].map(_ => ''),
      buttonClicks: [...Array(10).keys()].map(_ => 0),
      split: 0.5,
      collapse: [],
      selectData: [],
      selectDatas: [{
        value: 'beijing',
        label: '北京',
        children: [
          {
            value: 'gugong',
            label: '故宫'
          },
          {
            value: 'tiantan',
            label: '天坛'
          },
          {
            value: 'wangfujing',
            label: '王府井'
          }
        ]
      }, {
        value: 'jiangsu',
        label: '江苏',
        children: [
          {
            value: 'nanjing',
            label: '南京',
            children: [
              {
                value: 'fuzimiao',
                label: '夫子庙',
              }
            ]
          },
          {
            value: 'suzhou',
            label: '苏州',
            children: [
              {
                value: 'zhuozhengyuan',
                label: '拙政园',
              },
              {
                value: 'shizilin',
                label: '狮子林',
              }
            ]
          }
        ],
      }],
      color: '',
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
