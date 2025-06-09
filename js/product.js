new Vue({
  el: "#app",
  data: {
    product: null,
    cart: JSON.parse(localStorage.getItem("cart")) || []
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get("id"));
    fetch("data/products.json")
      .then(res => res.json())
      .then(data => {
        this.product = data.find(p => p.id === id);
      });
  },
  methods: {
    addToCart(product) {
      if (product.stock === 0) return; // don't allow adding if out of stock

      const existing = this.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(this.cart));
      alert("Item added to cart!");
    }
  }
});
