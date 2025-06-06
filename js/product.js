new Vue({
  el: "#app",
  data: {
    product: null
  },
  created() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    fetch("data/products.json")
      .then(res => res.json())
      .then(products => {
        this.product = products.find(p => p.id == id);
      });
  },
  methods: {
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to cart!");
    }
  }
});
