<template>
  <section class="section-products">
    <div class="header text-center">
      <h3>Featured Product</h3>
      <h2>Popular Products</h2>
    </div>

    <div class="row q-col-gutter-lg">
      <div 
        class="col-12 col-sm-6 col-md-4 col-lg-3" 
        v-for="item in products" 
        :key="item.id"
      >
        <div class="single-product">
          <div class="part-1" :style="backgroundImage(item.image)">
            <span v-if="item.discount" class="discount">{{ item.discount }}</span>
            <span v-if="item.new" class="new">new</span>

            <ul>
              <li><a href="#"><i class="fas fa-shopping-cart"></i></a></li>
              <li><a href="#"><i class="fas fa-heart"></i></a></li>
              <li><a href="#"><i class="fas fa-plus"></i></a></li>
              <li><a href="#"><i class="fas fa-expand"></i></a></li>
            </ul>
          </div>

          <div class="part-2">
            <h3 class="product-title">{{ item.title }}</h3>
            <h4 v-if="item.oldPrice" class="product-old-price">{{ item.oldPrice }}</h4>
            <h4 class="product-price">{{ item.price }}</h4>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ProductList",

  data() {
    return {
      products: [
        { id: 1, title: "Product 1", price: "$49.99", oldPrice: "$79.99", image: "https://i.ibb.co/L8Nrb7p/1.jpg" },
        { id: 2, title: "Product 2", price: "$49.99", discount: "15% OFF", image: "https://i.ibb.co/cLnZjnS/2.jpg" },
        { id: 3, title: "Product 3", price: "$49.99", oldPrice: "$79.99", image: "https://i.ibb.co/L8Nrb7p/1.jpg" },
        { id: 4, title: "Product 4", price: "$49.99", new: true, image: "https://i.ibb.co/cLnZjnS/2.jpg" },
        // puedes seguir agregando
      ]
    }
  },

  methods: {
    backgroundImage(url) {
      return {
        background: `url(${url}) no-repeat center`,
        backgroundSize: "cover"
      }
    }
  }
}
</script>

<style scoped>
.section-products {
  padding: 40px 0;
}

.header h3 {
  color: #fe302f;
  font-weight: 500;
}

.header h2 {
  font-size: 2rem;
  color: #444;
  margin-top: 0;
}

/* Tarjeta */
.single-product {
  margin-bottom: 20px;
}

/* Imagen */
.part-1 {
  position: relative;
  height: 260px;
  overflow: hidden;
  border-radius: 12px;
  transition: transform 0.3s;
}

.part-1:hover {
  transform: scale(1.03);
}

/* Badges */
.discount,
.new {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 4px 10px;
  font-size: 0.75rem;
  color: white;
  text-transform: uppercase;
  border-radius: 5px;
}

.discount {
  background: #fe302f;
}

.new {
  background: #333;
}

/* Hover icons */
.part-1 ul {
  position: absolute;
  bottom: -50px;
  left: 15px;
  opacity: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  transition: 0.4s;
}

.part-1:hover ul {
  bottom: 20px;
  opacity: 1;
}

.part-1 ul li {
  display: inline-block;
  margin-right: 5px;
}

.part-1 ul li a {
  display: inline-block;
  width: 38px;
  height: 38px;
  background: white;
  color: #444;
  text-align: center;
  line-height: 38px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,.1);
}

.part-1 ul li a:hover {
  color: #fe302f;
}

/* Textos */
.product-title {
  font-size: 1rem;
  margin-bottom: 4px;
}

.product-price,
.product-old-price {
  display: inline-block;
  font-size: 1rem;
  margin-right: 5px;
}

.product-old-price {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
