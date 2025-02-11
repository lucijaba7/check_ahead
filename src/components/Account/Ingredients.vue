<template>
  <div>
    <div
      v-for="(content, index) in ingredientCategories()"
      :key="content.category"
      class="custom-control x custom-checkbox text-left mt-3"
    >
      <span
        :href="'#id' + index"
        data-toggle="collapse"
        class="icon-caret-right collapsed arrow"
        style="font-size: 20px"
        @click="rotate"
      ></span>
      <span :class="classIcon(content)"></span>
      <label>
        <input
          type="checkbox"
          @click="checkAll(content)"
          v-model="selectedCat"
          :value="content"
          @change="onChange"
          class="custom-control-input"
        />
        <div class="custom-control-label pl-2">
          {{ content }}
        </div>
      </label>
      <h2 class="line1" style="width: 100%"></h2>

      <!-- dropdown -->
      <div
        v-for="ingredient in filterIngredients(content)"
        :key="ingredient"
        :id="'id' + index"
        class="collapse"
      >
        <div class="dropdown-item" style="margin-left: 25px">
          <label>
            <input
              type="checkbox"
              v-model="selectedIngr"
              :value="ingredient"
              @change="
                updateCheckAll(content);
                onChange();
              "
              class="custom-control-input"
            />
            <div class="custom-control-label">
              {{ ingredient }}
            </div>
          </label>
          <h2 class="line2" style="width: 100%"></h2>
        </div>
      </div>
    </div>

    <div class="text-left mt-4">
      <label form="exampleInputCustom">CUSTOM:</label>
      <input
        type="text"
        class="form-control basic-input mb-0"
        id="exampleInputCustom"
        placeholder="e.g. citrus, petroleum..."
        v-model="tempCustom"
        @keyup="addCustom"
      />
      <div
        v-for="custom in custom_ingredients"
        :key="custom"
        class="text-left pill"
      >
        <span>{{ custom }} </span>
        <span class="icon-cancel-1" @click="deleteCustom(custom)"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import store from "@/store";

export default {
  name: "Ingredients",
  data() {
    return {
      currentUser: localStorage.getItem("user"),
      tempCustom: "",
      custom_ingredients: [],
      ingredients: [],
      allChecked: false,
      selectedIngr: [],
      selectedCat: [],
    };
  },
  watch: {
    custom_ingredients: function() {
      this.onChange();
    },
  },
  mounted() {
    this.getIngredients();
    this.selectedIngredients();
  },
  methods: {
    getIngredients() {
      db.collection("ingredients")
        .get()
        .then((querry) => {
          querry.forEach((doc) => {
            const data = doc.data();

            this.ingredients.push({
              name: data.name,
              category: data.category,
            });
          });
        });
    },
    addCustom(e) {
      if ((e.key === "," || e.key === "Enter") && this.tempCustom) {
        if (!this.custom_ingredients.includes(this.custom_ingredients)) {
          this.tempCustom =
            this.tempCustom
              .charAt(0)
              .toUpperCase()
              .replace(",", "") + this.tempCustom.slice(1);
          this.custom_ingredients.push(this.tempCustom.replace(",", ""));
        }
        this.tempCustom = "";
      }
    },
    deleteCustom(custom) {
      this.custom_ingredients = this.custom_ingredients.filter((item) => {
        return custom !== item;
      });
    },
    ingredientCategories() {
      return [...new Set(this.ingredients.map(({ category }) => category))];
    },
    classIcon(icon) {
      icon = icon.toLowerCase();
      return "icon-" + icon;
    },
    filterIngredients(name) {
      return this.ingredients
        .filter((key) => key.category.includes(name))
        .map(({ name }) => name);
    },
    checkAll(x) {
      let pom = this.ingredients.filter((key) => key.category.includes(x));
      let pom2 = this.filterIngredients(x);

      if (!pom2.every((r) => this.selectedIngr.includes(r))) {
        // Check all in that category
        for (var key in pom) {
          this.selectedIngr.push(pom[key].name);
        }
        this.allChecked = true;
      } else {
        // Uncheck all in that category
        for (var key in pom) {
          this.selectedIngr = this.selectedIngr.filter((item) => {
            return pom[key].name !== item;
          });
        }
        this.allChecked = false;
      }
      this.allChecked = false;
    },
    updateCheckAll(category) {
      let pom = this.filterIngredients(category);

      if (pom.every((r) => this.selectedIngr.includes(r))) {
        // If all checked, check the category
        this.allChecked = true;
        this.selectedCat.push(category);
      } else {
        // If something unchecked, uncheck the category
        this.allChecked = false;
        this.selectedCat = this.selectedCat.filter((item) => {
          return item !== category;
        });
      }
    },
    rotate(e) {
      const element = e.target;
      if (element.className.includes("collapsed")) {
        element.style.transform = "rotate(90deg)";
      } else {
        element.style.transform = "rotate(0deg)";
      }
    },
    async updateList() {
      db.collection("users")
        .doc(this.currentUser)
        .set(
          {
            selectedIngredients: this.selectedIngr,
            customIngredients: this.custom_ingredients,
          },
          { merge: true }
        ); // data should be merged into the existing document

      if (this.$router.currentRoute.name == "IngredientsList") {
        // if changes were made to the ingredients list
        let ingredientsList = [];
        ingredientsList.push(...this.selectedIngr, ...this.custom_ingredients);

        let query = await db
          .collection("users")
          .doc(this.currentUser)
          .collection("products")
          .get();

        for (let doc of query.docs) {
          let result = await db
            .collection("products")
            .doc(doc.id)
            .get();

          let product_info = result.data();

          let filter = product_info.ingredients.filter((key) =>
            ingredientsList.includes(key)
          );

          let suitable = "";
          if (filter == 0) suitable = true;
          else suitable = false;

          await db
            .collection("users")
            .doc(this.currentUser)
            .collection("products")
            .doc(doc.id)
            .update({
              suitable: suitable,
            });
        }
      }

      this.$emit("toggle");
    },
    async selectedIngredients() {
      if (store.active == true) {
        let results = await db
          .collection("users")
          .doc(this.currentUser)
          .get();

        const data = results.data();
        this.selectedIngr.push(...data.selectedIngredients);
        this.custom_ingredients.push(...data.customIngredients);

        let categories = this.ingredientCategories();

        // update all checked for every category
        for (let i = 0; i < categories.length; i++) {
          this.updateCheckAll(categories[i]);
        }
      }
    },
    onChange() {
      if (this.selectedIngr.length > 0 || this.custom_ingredients.length > 0)
        this.$emit("enable");
      if (this.selectedIngr.length == 0 && this.custom_ingredients.length == 0)
        this.$emit("disable");
    },
  },
};
</script>

<style scoped>
.custom-control.x {
  padding-left: 0;
}

/* Add custom ingredients */

.pill {
  display: inline-block;
  margin: 15px 8px 0 0;
  padding: 5px 10px;
  background: #eee;
  border-radius: 20px;
  font-size: 9px;
  letter-spacing: 1px;
  font-weight: bold;
}
.pill .icon-cancel-1 {
  font-size: 10px;
}
.pill .icon-cancel-1::before {
  font-size: 10px;
  cursor: pointer;
  vertical-align: 1px;
}
</style>
