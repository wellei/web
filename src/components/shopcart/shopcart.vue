<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <span class="cart" @click="showCartList">
          <span class="icon" :class="{active:foodList.length > 0}">
            <i class="icon-shopping_cart"></i>
          </span>
        </span>
        <span class="count" v-show="totalNumber>0">{{totalNumber}}</span>
        <span class="price">{{totalPrice}}</span>
        <span class="delivery-price">另需配送费￥{{deliveryPrice}}</span>
      </div>
      <div class="content-right">
        <span v-if="totalPrice === 0 ">20起送</span>
        <span v-else-if="totalPrice < minPrice ">还差$￥{{minPrice - totalPrice}}起送</span>
        <span v-else class="active" @click = "toPay">去结算</span>
      </div>
    </div>
    <div class="ball-wrapper">
      <transition-group
        name="drop"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
      >
        <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
    <transition name="fade">
      <div class="cart-list" v-show="show">
        <div class="cart-content">
          <div class="cart-title">
            <span class="name">购物车</span>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="food-list" ref="listContent">
            <ul>
              <li
                class="food-item"
                v-for="(food,index) in foodList"
                :key="index"
                v-show="food.count > 0"
              >
                <span class="food-name">{{food.name}}</span>
                <span>
                  <span class="food-price">
                    <span class="iocn">￥{{food.price}}</span>
                  </span>
                  <span class="food-count">{{food.count}}</span>
                </span>
                <cartControl :food="food"></cartControl>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mask">
      <div class="mask" v-show="show" @click="showCartList"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import BScroll from "better-scroll";
import cartControl from "../cartControl/cartControl.vue";

export default {
  components: {
    cartControl
  },
  props: {
    minPrice: {
      type: Number
    },
    deliveryPrice: {
      type: Number
    },
    foodList: {
      type: Array,
      default() {
        return [
          {
            name: "sssdd",
            count: 0,
            price: 0
          }
        ];
      }
    }
  },
  data() {
    return {
      showList: false,
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: []
    };
  },
  computed: {
    totalPrice() {
      var totalPri = 0;
      for (let i = 0; i < this.foodList.length; i++) {
        totalPri += Number(this.foodList[i].price * this.foodList[i].count);
      }
      return totalPri;
    },
    totalNumber() {
      var totalPri = 0;
      var totalNumber = 0;
      for (let i = 0; i < this.foodList.length; i++) {
        totalNumber += this.foodList[i].count;
      }
      return totalNumber;
    },
    show() {
      let flag = this.showList;
      if (flag) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, { click: true });
          } else {
            this.scroll.refresh();
          }
        });
      }
      if(this.totalNumber == 0){
        this.showList = false;
        return false;
      }
      return flag;
    }
  },
  methods: {
    toPay(){
      alert("一共消费")
    },
    drop(el) {
      // el dom 对象
      for (var i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          // console.log(this.dropBalls);
          return;
        }
      }
    },
    showCartList() {
      // console.log(this.foodList);
      if (this.totalNumber > 0) {
        this.showList = !this.showList;
      }
    },
    empty() {
      this.foodList.forEach((food) => {
        food.count = 0;
      });
      this.showList = false;
    },
    beforeEnter(el) {
      // el 是Vue 钩子选择作用动画的 DOM 对象
      let count = this.balls.length;
      while (count) {
        count--;
        // 获取元素在 视窗的位置
        let ball = this.balls[count];
        if (ball.show) {
          let pos = ball.el.getBoundingClientRect();
          // console.log(pos);
          let x = pos.left + 20;
          let y = -(window.innerHeight - pos.top - 40);
          // el.style.display = "block";
          el.style.transform = `translate3d( 0,${y}px,0)`;
          let inner = el.querySelector(".inner-hook");
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(el, done) {
      let rf = el.offsetWidth; //  在钩子函数里面 el.offsetWidth 去刷新元素的大小，才能实现过度效果
      this.$nextTick(() => {
        let inner = el.querySelector(".inner-hook");
        inner.style.transform = ` translate3d(0,0,0) `;
        el.style.transform = ` translate3d(0,0,0) `;
      });
      setTimeout(function() {
        done();
      }, 400);
    },
    afterEnter(el) {
      var ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(260px);
}

.mask-enter-active,
.mask-leave-active {
  transition: all 0.5s;
}
.mask-enter, .mask-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.shopcart {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 48px;
  z-index: 10;
  background-color: #141d27;
  color: rgba(255, 255, 255, 0.4);
  .content {
    display: flex;
    position: relative;
    z-index: 999;
    .content-left {
      position: relative;
      background-color: #141d27;
      flex: 1;
      .cart {
        display: inline-block;
        position: relative;
        top: -10px;
        left: 12px;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background-color: #141d27;
        .icon {
          display: block;
          margin: 6px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          text-align: center;
          line-height: 44px;
          &.active {
            background-color: rgb(0, 160, 220);
            color: #fff;
          }
          .icon-shopping_cart {
            font-size: 24px;
          }
        }
      }
      .count {
        position: absolute;
        left: 44px;
        top: -8px;
        width: 24px;
        background-color: rgb(240, 20, 20);
        font-size: 9px;
        color: #fff;
        text-align: center;
        line-height: 16px;
        border-radius: 6px;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.4);
      }
      .price {
        display: inline-block;
        margin-top: 12px;
        margin-left: 6px;
        padding: 0 12px 0;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        line-height: 24px;
        font-size: 16px;
        vertical-align: top;
        font-weight: 700;
      }
      .delivery-price {
        display: inline-block;
        margin-top: 12px;
        padding-left: 12px;
        line-height: 24px;
        font-weight: 200;
        font-size: 12px;
        vertical-align: top;
      }
    }
    .content-right {
      flex: 0 0 107px;
      width: 105px;
      background-color: rgba(255, 255, 255, 0.4);
      span {
        display: block;
        font-size: 12px;
        text-align: center;
        background-color: #2b343b;
        font-weight: 700;
        line-height: 24px;
        padding: 12px;
        &.active {
          color: #fff;
          background-color: #00b33c;
        }
      }
    }
  }
  .cart-list {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 48px;
    z-index: 9;
    .cart-content {
      position: absolute;
      bottom: 0;
      width: 100%;
      max-height: 260px;
      .cart-title {
        height: 40px;
        font-size: 14px;
        font-weight: 200;
        line-height: 40px;
        padding: 0 18px 0;
        color: rgb(7, 17, 27);
        background-color: #f3f5f7;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .empty {
          color: rgb(0, 160, 220);
          font-size: 12px;
        }
      }
    }
    .food-list {
      background-color: #fff;
      padding: 0 18px;
      max-height: 219px;
      overflow: hidden;
      .food-item {
        display: flex;
        justify-content: space-between;
        height: 48px;
        padding: 12px 0;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        box-sizing: border-box;
        .food-name {
          color: rgb(7, 17, 27);
          font-size: 14px;
          line-height: 24px;
        }
        .food-price {
          color: rgb(240, 20, 20);
          font-size: 14px;
          font-weight: 700;
          line-height: 24px;
          .icon {
            font-size: 10px;
            font-weight: normal;
          }
        }
      }
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(7, 17, 27, 0.6);
    z-index: -1;
    filter: blur(10px);
  }
  .ball-wrapper {
    .ball {
      position: fixed;
      left: 30px;
      bottom: 20px;
      z-index: 999;
      &.drop-enter-active {
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
      }
      .inner {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        transition: all 0.4s;
        background-color: rgb(0, 160, 220);
      }
    }
  }
}
</style>