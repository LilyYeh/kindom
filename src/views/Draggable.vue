<template>
  <div class="game">
    <!--table class="board" id="target">
      <tr v-for="i in 5" :key="i">
        <td v-for="j in 6" :key="j"></td>
      </tr>
    </table>
    <div class="game-token">
      <div id="castle1" class="token castle">城堡 x1</div>
      <div id="castle2" class="token castle">城堡 x2</div>
      <div id="castle3" class="token castle">城堡 x3</div>
      <div id="castle4" class="token castle">城堡 x4</div>

      <div id="score-minus1" class="token score-minus">-1</div>
      <div id="score-minus2" class="token score-minus">-2</div>
      <div id="score-minus3" class="token score-minus">-3</div>
      <div id="score-minus4" class="token score-minus">-4</div>
      <div id="score-minus5" class="token score-minus">-5</div>
      <div id="score-minus6" class="token score-minus">-6</div>

      <div id="score-add1" class="token score-add">+1</div>
      <div id="score-add2" class="token score-add">+2</div>
      <div id="score-add3" class="token score-add">+3</div>
      <div id="score-add4" class="token score-add">+4</div>
      <div id="score-add5" class="token score-add">+5</div>
      <div id="score-add6" class="token score-add">+6</div>

      <div id="treasure" class="token special">寶藏<br>(分數*2倍)</div>
      <div id="dragon"   class="token special">火龍<br>(不計正分)</div>
      <div id="mountain" class="token special">山脈<br>(隔離用)</div>
      <div id="witch"    class="token special">巫師<br>(升級城堡等級)</div>
    </div-->
    <!--draggable class="board" :list="board" :group="{ name: 'myGroup'}">
      <template #item="{element}">
        <td class="token">{{element}}</td>
      </template>
    </draggable-->

    <div class="board">
      <draggable class="area" :list="board1" :group="{ name: 'myGroup', put: true}"  @add="onAdd" @end="onEnd">
        <template #item="{element}">
          <div class="token">{{element}}</div>
        </template>
      </draggable>
      
      <!--draggable class="area" :list="board2" :group="{ name: 'myGroup'}" @change="log(this.board2)">
        <template #item="{element}">
          <div class="token">{{element}}</div>
        </template>
      </draggable>
      
      <draggable class="area" :list="board3" :group="{ name: 'myGroup'}" @change="log(this.board3)">
        <template #item="{element}">
          <div class="token">{{element}}</div>
        </template>
      </draggable>
      
      <draggable class="area" :list="board4" :group="{ name: 'myGroup'}" @change="log(this.board4)">
        <template #item="{element}">
          <div class="token">{{element}}</div>
        </template>
      </draggable>
      
      <draggable class="area" :list="board5" :group="{ name: 'myGroup'}" @change="log(this.board5)">
        <template #item="{element}">
          <div class="token">{{element}}</div>
        </template>
      </draggable>
      
      <draggable class="area" :list="board6" :group="{ name: 'myGroup'}" @change="log(this.board6)">
        <template #item="{element}">
          <div class="token">{{element}}</div>
        </template>
      </draggable-->
    </div>
    
    <draggable class="game-token" :list="tokens" :group="{ name: 'myGroup'}" @start="onStart" :move="checkMove">
      <template #item="{element}">
        <div class="token castle">{{element}}</div>
      </template>
    </draggable>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';

  export default {
    components: {
      draggable
    },
    data() {
      return {
        board1: [],
        //board2: [],
        //board3: [],
        //board4: [],
        //board5: [],
        //board6: [],
        tokens: ['城堡 x1', '城堡 x2', '城堡 x3', '城堡 x4', "寶藏", "火龍"]
      }
    },
    computed: {},
    methods: {
      log(board) {
        if(board.length>1){
          this.tokens.unshift(board[1]);
          board.splice(1,1);
        }
      },
      checkMove() {
        console.log('checkMove');
      },
      onStart() {
        console.log('onStart');
      },
      onAdd(evt) {
        console.log('onAdd');
        if(evt.to.childElementCount>1){
          this.board1 = this.oldBoard1;
        }
      },
      onEnd() {
        console.log('onEnd');
      },
      onUpdate() {
        console.log('onUpdate');
      },
      onFilter() {
        console.log('onFilter');
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .game {
    width:100%;
  }
  .board {
    width: 54%;
    display: inline-block;
    float: left;
    border: 1px solid black;
    min-height: 200px;
  }
  .board > tr {

  }
  .board > td {
    float: left;
    margin: 3px;
  }
  .board .area {
    float: left;
    width: 120px;
    height: 110px;
    margin: 4px;
  }
  .game-token {
    display: inline-block;
    float: right;
    width: 45%;
    min-height: 200px;
    border: 1px solid black;
  }
  .token {
    float: left;
    border: 1px solid black;
    width: 120px;
    height: 110px;
    cursor: pointer;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .game-token .token {
    margin: 10px;
  }
  .score-minus {
    color: red;
  }
  .score-add {
    color:blue;
  }
  
</style>
