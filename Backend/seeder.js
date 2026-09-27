const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "config/config.env"), override: true });

const Product  = require(path.join(__dirname, "models/product"));
const Category = require(path.join(__dirname, "models/category"));
const User     = require(path.join(__dirname, "models/user"));

// ─── 1. Categories ────────────────────────────────────────────────────────────
const categoriesData = [
  { name: "T-Shirts",    slug: "t-shirts",    description: "Casual and formal t-shirts for all occasions" },
  { name: "Pants",       slug: "pants",        description: "Jeans, trousers, and joggers for every style" },
  { name: "Shoes",       slug: "shoes",        description: "Sneakers, boots, and formal shoes" },
  { name: "Accessories", slug: "accessories",  description: "Bags, watches, belts and more" },
  { name: "Jackets",     slug: "jackets",      description: "Winter and casual jackets" },
];

// ─── 2. Products (category name used as key, replaced by ObjectId after insert) ─
const productsData = [
  // T-Shirts
  { name: "Classic White Tee",      description: "Timeless white cotton t-shirt, everyday comfort.", price: 149,  stock: 120, colors: ["White", "Gray"],         sizes: ["S","M","L","XL"],     categoryName: "T-Shirts",    images: [{ url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop", public_id: "white_tee_1" }] },
  { name: "Graphic Print Tee",      description: "Bold graphic print on premium cotton.",            price: 199,  stock: 80,  colors: ["Black", "Navy"],         sizes: ["S","M","L"],           categoryName: "T-Shirts",    images: [{ url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop", public_id: "graphic_tee_1" }] },
  { name: "Polo Shirt",             description: "Smart-casual polo shirt with embroidered logo.",   price: 299,  stock: 60,  colors: ["Navy", "White", "Red"],  sizes: ["S","M","L","XL","XXL"],categoryName: "T-Shirts",    images: [{ url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop", public_id: "polo_shirt_1" }] },
  { name: "Striped Tee",            description: "Nautical-inspired stripe pattern, slim fit.",      price: 179,  stock: 90,  colors: ["Blue/White","Red/White"], sizes: ["M","L","XL"],          categoryName: "T-Shirts",    images: [{ url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop", public_id: "striped_tee_1" }] },

  // Pants
  { name: "Slim Fit Jeans",         description: "Classic 5-pocket slim fit denim jeans.",           price: 499,  stock: 75,  colors: ["Blue", "Black"],         sizes: ["30","32","34","36"],   categoryName: "Pants",       images: [{ url: "https://images.unsplash.com/photo-1542272604-780c36856d64?w=600&auto=format&fit=crop", public_id: "slim_jeans_1" }] },
  { name: "Chino Trousers",         description: "Smart chino trousers, perfect for the office.",    price: 449,  stock: 55,  colors: ["Beige","Navy","Olive"],   sizes: ["30","32","34","36","38"],categoryName: "Pants",       images: [{ url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop", public_id: "chino_1" }] },
  { name: "Cargo Pants",            description: "Utility cargo pants with multiple pockets.",       price: 399,  stock: 65,  colors: ["Khaki","Black"],          sizes: ["M","L","XL"],          categoryName: "Pants",       images: [{ url: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop", public_id: "cargo_1" }] },
  { name: "Jogger Sweatpants",      description: "Comfortable fleece joggers for lounging or gym.",  price: 299,  stock: 100, colors: ["Gray","Black","Navy"],    sizes: ["S","M","L","XL"],      categoryName: "Pants",       images: [{ url: "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=600&auto=format&fit=crop", public_id: "jogger_1" }] },

  // Shoes
  { name: "White Leather Sneakers", description: "Minimalist white leather sneakers, clean look.",   price: 799,  stock: 50,  colors: ["White"],                  sizes: ["40","41","42","43","44"],categoryName: "Shoes",       images: [{ url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop", public_id: "sneakers_1" }] },
  { name: "Chelsea Boots",          description: "Classic leather Chelsea boots for any occasion.",   price: 1199, stock: 35,  colors: ["Black","Brown"],          sizes: ["40","41","42","43","44"],categoryName: "Shoes",       images: [{ url: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&auto=format&fit=crop", public_id: "chelsea_1" }] },
  { name: "Running Shoes",          description: "Lightweight mesh running shoes with cushioning.",   price: 899,  stock: 70,  colors: ["Black/Red","Blue/White"], sizes: ["39","40","41","42","43"],categoryName: "Shoes",       images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop", public_id: "running_1" }] },
  { name: "Slip-On Loafers",        description: "Casual suede loafers for effortless style.",        price: 699,  stock: 45,  colors: ["Brown","Navy"],           sizes: ["40","41","42","43"],    categoryName: "Shoes",       images: [{ url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop", public_id: "loafers_1" }] },

  // Accessories
  { name: "Leather Belt",           description: "Genuine leather belt with silver buckle.",          price: 199,  stock: 150, colors: ["Black","Brown"],          sizes: ["S","M","L","XL"],      categoryName: "Accessories", images: [{ url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop", public_id: "belt_1" }] },
  { name: "Canvas Backpack",        description: "Durable canvas backpack with laptop compartment.",  price: 599,  stock: 40,  colors: ["Black","Olive","Navy"],   sizes: ["One Size"],            categoryName: "Accessories", images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop", public_id: "backpack_1" }] },
  { name: "Classic Watch",          description: "Minimalist stainless steel watch, water resistant.", price: 1499, stock: 25,  colors: ["Silver","Gold"],          sizes: ["One Size"],            categoryName: "Accessories", images: [{ url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop", public_id: "watch_1" }] },
  { name: "Wool Scarf",             description: "Soft merino wool scarf for cold days.",              price: 249,  stock: 80,  colors: ["Gray","Camel","Black"],   sizes: ["One Size"],            categoryName: "Accessories", images: [{ url: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&auto=format&fit=crop", public_id: "scarf_1" }] },

  // Jackets
  { name: "Denim Jacket",           description: "Washed denim jacket, a wardrobe staple.",            price: 699,  stock: 55,  colors: ["Blue","Black"],           sizes: ["S","M","L","XL"],      categoryName: "Jackets",     images: [{ url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop", public_id: "denim_jacket_1" }] },
  { name: "Puffer Jacket",          description: "Warm puffer jacket with down insulation.",           price: 999,  stock: 40,  colors: ["Black","Navy","Olive"],   sizes: ["S","M","L","XL","XXL"],categoryName: "Jackets",     images: [{ url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop", public_id: "puffer_jacket_1" }] },
  { name: "Leather Biker Jacket",   description: "Genuine leather moto jacket with zip details.",     price: 1799, stock: 20,  colors: ["Black","Brown"],          sizes: ["S","M","L","XL"],      categoryName: "Jackets",     images: [{ url: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&auto=format&fit=crop", public_id: "biker_jacket_1" }] },
  { name: "Windbreaker",            description: "Lightweight waterproof windbreaker for outdoors.",   price: 599,  stock: 60,  colors: ["Blue","Red","Green"],     sizes: ["S","M","L","XL"],      categoryName: "Jackets",     images: [{ url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop", public_id: "windbreaker_1" }] },
];

// ─── 3. Seeder logic ──────────────────────────────────────────────────────────
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    console.log("🗑️  Cleared existing products & categories");

    // Insert categories
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`📦 Inserted ${insertedCategories.length} categories`);

    // Build a name → ObjectId map
    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Map categoryName string → real ObjectId
    const productsWithIds = productsData.map(({ categoryName, ...rest }) => ({
      ...rest,
      category: categoryMap[categoryName],
    }));

    // Insert products
    const insertedProducts = await Product.insertMany(productsWithIds);
    console.log(`🛍️  Inserted ${insertedProducts.length} products`);

    // Ensure Admin user exists
    const adminEmail = 'admin@shopwave.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        FirstName: 'Admin',
        LastName: 'User',
        email: adminEmail,
        phone: '01000000000',
        password: 'admin123456',
        role: 'admin',
        birthDate: new Date('1995-01-01'),
        gender: 'male'
      });
      console.log('👤 Admin user created (admin@shopwave.com)');
    } else {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('👤 Admin user updated (admin@shopwave.com)');
    }

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDB();
