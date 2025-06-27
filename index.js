require("dotenv").config(); // ← THIS is what loads .env values into process.env

const express = require("express");
const app = express();
const supabase = require("./supabaseClient");
const port = 3000;

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const session = require("express-session");
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true only in HTTPS
}));

// Redirect / to login page
app.get("/", (req, res) => {
  res.redirect("/login.html");
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

if (error) {
  console.error("Login error:", error.message); // log it
  return res.redirect(`/error.html?msg=${encodeURIComponent(error.message)}`);
}

  // after successful login
req.session.user = data.user;  // using express-session

  res.redirect("/dashboard.html");
});

app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "private", "dashboard.html"));
});

app.get("/guide.html", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  res.sendFile(path.join(__dirname, "private", "guide.html"));
});

app.get("/toporder.html", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  res.sendFile(path.join(__dirname, "private", "toporder.html"));
});

app.get("/about.html", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  res.sendFile(path.join(__dirname, "private", "about.html"));
});



app.post("/save-profile", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }

  const { name, email, dateJoined, age, gender } = req.body;

  const { error } = await supabase.from("Profile").insert([
    {
      name,
      email,
      date_joined: dateJoined,
      age: parseInt(age),
      gender,
      user_id: req.session.user.id,
    },
  ]);

  if (error) {
    return res.redirect(`/error.html?msg=${encodeURIComponent(error.message)}`);
  }

  res.redirect("/profile.html?success=true"); // ✅ redirect with success flag
});

app.get("/api/profile", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

const { data, error } = await supabase
  .from("Profile")
  .select("*")
  .eq("user_id", req.session.user.id)
  .single(); // Only safe if user_id is unique



  if (error) {
    console.error("Supabase fetch error:", error.message);
    return res.status(500).json({ error: "Profile not found" });
  }

  res.json(data);
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/dashboard.html");
    }
    res.clearCookie("connect.sid"); // optional: clear session cookie
    res.redirect("/login.html");
  });
});


app.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  // Check password confirmation
  if (password !== confirmPassword) {
    return res.redirect(`/error.html?msg=${encodeURIComponent("Passwords do not match")}`);
  }

  // Sign up using Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstname,
        last_name: lastname,
      },
    },
  });

  if (error) {
    return res.redirect(`/error.html?msg=${encodeURIComponent(error.message)}`);
  }

  res.redirect("/signup_success.html");
});

app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
