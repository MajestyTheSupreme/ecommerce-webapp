new Vue({
  el: "#app",
  data: {
    products: [],
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    search: '',
    navOpen: false,
    selectedCategory: '',
    categories: [],
    minPrice: null,
    maxPrice: null,
    sortOption: '',
    showToast: false,
    darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
    lastScrollY: 0,
    hideNav: false,
    selectedProduct: null,
    pageVisible: false // ✅ NEW
  },

  computed: {
    filteredProducts() {
      const term = this.search.toLowerCase();
      let filtered = this.products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(term);
        const matchesCategory = this.selectedCategory === '' || product.category === this.selectedCategory;
        const matchesMin = this.minPrice === null || product.price >= this.minPrice;
        const matchesMax = this.maxPrice === null || product.price <= this.maxPrice;
        return matchesSearch && matchesCategory && matchesMin && matchesMax;
      });

      if (this.sortOption === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (this.sortOption === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (this.sortOption === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortOption === 'name-desc') {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
      }

      return filtered;
    },

    cartItemCount() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
  },

  created() {
  const savedProducts = localStorage.getItem("products");
  if (savedProducts) {
    this.products = JSON.parse(savedProducts);
  } else {
    fetch('data/products.json')
      .then(res => res.json())
      .then(data => {
        this.products = data;
        this.categories = [...new Set(data.map(p => p.category || 'Uncategorized'))];
        localStorage.setItem("products", JSON.stringify(data)); // Cache it initially
      });
  }

  if (this.darkMode) {
    document.documentElement.classList.add('dark');
  }
}
,

  mounted() {
    window.addEventListener("storage", () => {
      this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    });

    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleScroll);

    this.pageVisible = true; // ✅ Start transition
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleScroll);
  },

  watch: {
    darkMode(val) {
      localStorage.setItem("darkMode", JSON.stringify(val));
      if (val) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },

  methods: {
    addToCart(product) {
      if (product.stock === 0) return;
      const existing = this.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }

      product.stock -= 1;
      localStorage.setItem("cart", JSON.stringify(this.cart));

      const cartIcon = document.querySelector(".cart-icon");
      if (cartIcon) {
        cartIcon.classList.remove("cart-animate");
        void cartIcon.offsetWidth;
        cartIcon.classList.add("cart-animate");
      }

      this.showToast = true;
      setTimeout(() => this.showToast = false, 2000);
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },

    handleScroll() {
      if (window.innerWidth <= 768) {
        const currentY = window.scrollY;
        this.hideNav = currentY > this.lastScrollY && currentY > 80;
        this.lastScrollY = currentY;
      } else {
        this.hideNav = false;
      }
    },
    saveProducts() {
      localStorage.setItem("products", JSON.stringify(this.products));
}


  }
});
