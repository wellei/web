<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li
          v-for="(item,index) in goods"
          :key="index"
          :class="{current:currentIndex === index}"
          @click="selectFood(index)"
        >
          <span class="text">
            <span v-show="item.type >=0" :class="classMap[item.type]" class="icon"></span>
            <span class="title">{{item.name}}</span>
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="foods-list foods-list-hook">
          <h2 class="title">{{item.name}}</h2>
          <div class="food-item" v-for="(food,ind) in item.foods" :key="ind">
            <div @click="detaile(food)">
              <div class="item-left">
                <img :src="food.icon" alt>
              </div>
              <div class="item-right">
                <h2 class="name">{{food.name}}</h2>
                <p class="dec">{{food.description}}</p>
                <p class="dec">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </p>
                <p class="price">
                  <span class="now">
                    <span>￥</span>
                    {{food.price}}
                  </span>
                  <span class="old" v-show="food.oldPrice">
                    <span>￥</span>
                    {{food.oldPrice}}
                  </span>
                </p>
              </div>
            </div>
            <div class="cart-Control">
              <cartControl :food="food"></cartControl>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <shopcart
      :minPrice="seller.minPrice"
      :deliveryPrice="seller.deliveryPrice"
      :foodList="selectFoods"
      ref="shopCart"
    ></shopcart>
    <food :food="foodDetaile" ref="food"></food>
  </div>
</template>

<script>
import shopcart from "../shopcart/shopcart.vue";
import food from "../food/food.vue";
// npm install better-scroll
import BScroll from "better-scroll";
import cartControl from "../cartControl/cartControl.vue";
import bus from "../../bus.js";
export default {
  props: ["seller"],
  components: {
    shopcart,
    cartControl,
    food
  },
  data() {
    return {
      goods: null,
      classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
      heightScroll: [],
      scrollY: 0,
      foodDetaile: {},
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.heightScroll.length; i++) {
        let height1 = this.heightScroll[i];
        let height2 = this.heightScroll[i + 1];
        if (!height2 || (this.scrollY < height2 && this.scrollY >= height1)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      if (this.goods) {
        this.goods.forEach(good => {
          good.foods.forEach(food => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
      }
      return foods;
    }
  },
  created() {
    this.$axios
      .get("/api/goods")
      .then(res => {
        if (res.data.errno === 0) {
          this.goods = res.data.goods;
          this.$nextTick(() => {
            this._initScroll();
            this._calcHeight();
            // console.log(this.heightScroll);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    bus.$on("cart-add", target => {
      this._drop(target);
    });
  },
  methods: {
    detaile(food) {
      // console.log(food);
      this.$refs.food.show();
      this.foodDetaile = food;
    },
    _drop(target) {
      this.$nextTick(() => {
        this.$refs.shopCart.drop(target);
      });
    },
    selectFood(index) {
      let foodList = this.$refs.foodsWrapper.querySelectorAll(
        ".foods-list-hook"
      );
      this.foodsScroll.scrollToElement(foodList[index], 300);
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, { click: true });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.floor(pos.y)) + 1;
      });
    },
    _calcHeight() {
      let foodsList = this.$refs.foodsWrapper.querySelectorAll(
        ".foods-list-hook"
      );
      let height = 0;
      this.heightScroll.push(height);
      for (var i = 0; i < foodsList.length; i++) {
        height += foodsList[i].clientHeight;
        this.heightScroll.push(height);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/css/mixins.scss";
.goods {
  display: flex;
  position: absolute;
  width: 100%;
  top: 177px;
  bottom: 48px;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background-color: #f3f5f7;
    ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      li {
        display: table;
        height: 54px;
        padding: 0 12px;
        font-size: 0px;
        font-weight: 200;
        line-height: 14px;
        &.current {
          margin-top: -1px;
          font-weight: 700;
          background-color: #fff;
          .text {
            border-bottom: none;
          }
        }
        .text {
          height: 54px;
          width: 54px;
          font-size: 12px;
          display: table-cell;
          vertical-align: middle;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
          .icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            @include bgimg(images/decrease_3);
            background-size: 12px 12px;
            background-repeat: no-repeat;
            vertical-align: middle;
            margin-right: 2px;
            margin-top: 2px;
            &.decrease {
              @include bgimg(images/decrease_3);
            }
            &.discount {
              @include bgimg(images/discount_3);
            }
            &.special {
              @include bgimg(images/special_3);
            }
            &.invoice {
              @include bgimg(images/invoice_3);
            }
            &.guarantee {
              @include bgimg(images/guarantee_3);
            }
          }
        }
      }
    }
  }
  .foods-wrapper {
    flex: 1;
    .foods-list {
      .title {
        padding-left: 14px;
        border-left: 2px solid #d9dde1;
        background-color: #f3f5f7;
        font-size: 12px;
        line-height: 26px;
        color: rgb(147, 153, 159);
      }
      .food-item {
        position: relative;
        display: flex;
        margin: 18px 18px 0;
        padding-bottom: 18px;
        font-size: 0;
        border-bottom: 1px solid rgb(7, 17, 27, 0.1);
        div{
          display: flex;
        }
        &:last-child {
          border-bottom: none;
        }
        .item-left {
          vertical-align: top;
          flex: 0 0 57px;
          display: inline-block;
          font-size: 14px;
          margin-right: 10px;
          img {
            width: 57px;
            height: 57px;
            border-radius: 3px;
          }
        }
        .item-right {
          position: relative;
          vertical-align: top;
          display: inline-block;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
          .name {
            margin-top: 2px;
            font-size: 14px;
            left: 14px;
            color: rgb(7, 17, 27);
            font-weight: 700;
          }
          .dec {
            margin: 8px 0;
            font-size: 14px;
            line-height: 13px;
            color: rgb(147, 153, 159);
            .count {
              display: inline-block;
              margin-right: 12px;
            }
            .rating {
              display: inline-block;
            }
          }
          .price {
            .now {
              color: rgb(240, 20, 20);
              font-size: 14px;
              font-weight: 700;
              margin-right: 8px;
              span {
                font-style: 10px;
                font-weight: normal;
              }
            }
            .old {
              color: rgb(147, 153, 159);
              font-size: 10px;
              font-weight: 700;
              text-decoration: line-through;
              span {
                font-style: 10px;
                font-weight: normal;
              }
            }
          }
        }
        .cart-Control {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>