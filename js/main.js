new Vue({
  el: "#app",
  data: {
  products: [],
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  search: ''

},
computed: {
    filteredProducts() {
      const term = this.search.toLowerCase();
      return this.products.filter(product =>
        product.name.toLowerCase().includes(term)
      );
    }
  },

  created() {
    fetch('data/products.json')
      .then(res => res.json())
      .then(data => {
        this.products = data;
      });
  },
  methods: {
    addToCart(product) {
  const existing = this.cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    this.cart.push({ ...product, quantity: 1 });
  }
  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(this.cart));
}
  }
});
