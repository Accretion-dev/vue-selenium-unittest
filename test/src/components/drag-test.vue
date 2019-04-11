<template lang="pug">
  .row
    .col-3
      .mb-2
      Tree(:data="tree1data" draggable cross-tree)
          div(slot-scope="{data, store}")
            template(v-if="!data.isDragPlaceHolder")
              b(v-if="data.children && data.children.length" @click="store.toggleOpen(data)") {{data.open ? '-' : '+'}}&nbsp;
              span {{data.text}}
</template>

<script>
const clsPrefix = 'vue-selenium-unittest'
import {DraggableTree} from 'vue-draggable-nested-tree'

export default {
  name: 'drag-test',
  components: {Tree: DraggableTree},
  data () {
    return {
      tree1data: [
        {text: 'node 1'},
        {text: 'node 2'},
        {text: 'node 4'},
        {text: 'node 5', children: [
          {text: 'node 1'},
          {text: 'node 2', children: [
            {text: 'node 3'},
            {text: 'node 4'},
          ]},
          {text: 'node 2 undroppable', droppable: false, children: [
            {text: 'node 3'},
            {text: 'node 4'},
          ]},
          {text: 'node 2', children: [
            {text: 'node 3'},
            {text: 'node 4 undroppable', droppable: false},
          ]},
          {text: 'node 3'},
          {text: 'node 4'},
        ]},
      ],
  }},
  methods: {
  },
}
</script>

<style lang="scss">
.he-tree{
  border: 1px solid #ccc;
  padding: 5px;
}
.tree-node{
}
.tree-node-inner{
  // padding: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.draggable-placeholder{
}
.draggable-placeholder-inner{
  border: 1px dashed #0088F8;
  box-sizing: border-box;
  background: rgba(0, 136, 249, 0.09);
  color: #0088f9;
  text-align: center;
  padding: 0;
  display: flex;
  align-items: center;
}
.tree3{
  .tree-node-inner{
    border: none;
    padding: 0px;
  }
  .tree-node-inner-back:hover{
    background: #ddd;
  }
}
.tree4{
  .tree-node-inner{
    border: none;
    border-bottom: 1px solid #ccc;
    padding: 5px 5px;
    backgroud: #ccc;
  }
  .draggable-placeholder-inner{
    background-color: orangered;
  }
}
</style>
