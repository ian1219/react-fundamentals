/* ==========================================================================
   Lesson content
   --------------------------------------------------------------------------
   Every lesson is plain data, so adding or editing a lesson never requires
   touching the page code. Block types used in `body`:

     ["h", "Heading"]                     section heading
     ["p", "Text with `code` and **bold**"]
     ["list", ["item", "item"]]           bullet list
     ["steps", ["step", "step"]]          numbered step cards
     ["code", "jsx", `code`, "File.jsx"]  code block (filename optional)
     ["compare", { left, right }]         two code blocks side by side
     ["tree", `folder tree`]              folder structure diagram
     ["table", ["Col", "Col"], [[..]]]    simple table
     ["analogy" | "tip" | "warn" | "note", "Text"]
   ========================================================================== */

window.RK_MODULES = [
  { id: "start", title: "Getting Started", text: "What React is, how to set it up and what every file in a new project does." },
  { id: "core", title: "Core Concepts", text: "The five ideas that power every React app: JSX, components, props, state and events." },
  { id: "ui", title: "Building Real UIs", text: "Show and hide things, render lists, handle forms and share data between components." },
  { id: "beyond", title: "Going Further", text: "Side effects, styling, professional folder structure and your first mini project." },
];

window.RK_LESSONS = [
  /* ------------------------------------------------------------------ 1 */
  {
    id: "what-is-react",
    module: "start",
    title: "What is React?",
    minutes: 6,
    summary: "React is a JavaScript library for building user interfaces out of small, reusable pieces called components.",
    body: [
      ["h", "React in one sentence"],
      ["p", "React is a **JavaScript library** for building user interfaces (the part of a website people see and click). Instead of writing one giant page, you build small pieces called **components** and snap them together."],
      ["analogy", "Think of a website like a LEGO model. Each brick (a button, a navbar, a product card) is a component. You build each brick once, then reuse it as many times as you want."],
      ["h", "Why do people use React?"],
      ["list", [
        "**Reusable pieces** — write a `Button` once, use it on every page.",
        "**Automatic updates** — when your data changes, React updates the screen for you.",
        "**Easy to organize** — each piece of the UI lives in its own small file.",
        "**Huge community** — tons of tutorials, libraries and job openings.",
        "**Skills that travel** — React Native uses the same ideas to build mobile apps.",
      ]],
      ["h", "The old way vs the React way"],
      ["p", "With plain JavaScript you tell the browser **how** to change the page, step by step. With React you describe **what** the page should look like for the current data, and React figures out the steps."],
      ["compare", {
        left: { label: "Plain JavaScript", tone: "neutral", lang: "js", code: `
// You do every step yourself
const button = document.querySelector('#like');
const label = document.querySelector('#count');
let likes = 0;

button.addEventListener('click', () => {
  likes = likes + 1;
  label.textContent = likes + ' likes';
});` },
        right: { label: "React", tone: "good", lang: "jsx", code: `
// Describe the UI for the current data
function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button onClick={() => setLikes(likes + 1)}>
      {likes} likes
    </button>
  );
}` },
      }],
      ["note", "Don't worry if `useState` looks strange right now — you'll learn it in Lesson 7. For now, just notice how the React version **reads like a description** of the button."],
      ["h", "Words you'll hear a lot"],
      ["table", ["Word", "What it means"], [
        ["Component", "A reusable piece of UI. In code, it's a JavaScript function that returns markup."],
        ["JSX", "HTML-like syntax you write inside JavaScript."],
        ["Props", "Inputs you pass into a component — like arguments to a function."],
        ["State", "Data a component remembers that can change over time."],
        ["Hook", "A special function that starts with `use` (like `useState`) and adds features to a component."],
        ["Render", "When React runs your component and puts the result on the screen."],
      ]],
    ],
    takeaways: [
      "React is a library for building user interfaces from reusable components.",
      "You describe **what** the UI should look like; React handles **how** to update the page.",
      "The core vocabulary: components, JSX, props, state and hooks.",
    ],
    playground: `
function App() {
  return (
    <div>
      <h1>Hello, React! 👋</h1>
      <p>Change this text and watch the preview update.</p>
    </div>
  );
}`,
    quiz: [
      { q: "What is a React component?", options: ["A CSS file that styles the page", "A reusable piece of UI", "A database for your app", "A browser extension"], answer: 1, why: "A component is a reusable piece of UI — in code, a function that returns what should appear on screen." },
      { q: "With React, you mostly describe…", options: ["Every DOM step needed to change the page", "What the UI should look like for the current data", "How the web server should respond"], answer: 1, why: "React is declarative: you describe the result, React works out the DOM updates." },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    id: "setup",
    module: "start",
    title: "Setting Up Your First App",
    minutes: 7,
    summary: "Install Node.js, create a project with Vite, and see your first React app running in the browser.",
    body: [
      ["h", "What you need"],
      ["list", [
        "**Node.js** (the LTS version) from nodejs.org — it lets you run JavaScript tools on your computer and comes with `npm`.",
        "**A code editor** — VS Code is free and the most popular choice.",
        "**A terminal** — Command Prompt, PowerShell, or the terminal built into VS Code.",
      ]],
      ["h", "Check that Node is installed"],
      ["code", "bash", `
node -v
npm -v`],
      ["p", "If both commands print a version number (like `v22.11.0`), you're ready."],
      ["h", "Create a project with Vite"],
      ["p", "**Vite** (pronounced \"veet\", French for \"fast\") is a tool that creates a ready-to-use React project and runs a super fast development server."],
      ["code", "bash", `
npm create vite@latest my-first-app -- --template react
cd my-first-app
npm install
npm run dev`],
      ["steps", [
        "`npm create vite@latest` creates a new folder called `my-first-app` with a React starter inside.",
        "`cd my-first-app` moves your terminal into that folder.",
        "`npm install` downloads the packages the project needs (into `node_modules`).",
        "`npm run dev` starts the development server. Open the link it prints, usually `http://localhost:5173`.",
      ]],
      ["tip", "Keep `npm run dev` running while you code. Every time you save a file, the browser updates instantly — no refresh needed."],
      ["warn", "You may find old tutorials using `create-react-app`. It's **deprecated**. Use Vite (or a framework like Next.js) for new projects."],
      ["h", "Commands you'll use every day"],
      ["table", ["Command", "What it does"], [
        ["npm run dev", "Starts the local development server with live reload."],
        ["npm run build", "Creates optimized production files in the `dist/` folder."],
        ["npm run preview", "Serves the production build locally so you can test it."],
        ["npm install <name>", "Adds a new package (library) to your project."],
      ]],
      ["note", "No setup needed to follow this kit! Every lesson has a **Playground** button so you can run React right in your browser."],
    ],
    takeaways: [
      "Install Node.js LTS and a code editor like VS Code.",
      "Create new React projects with `npm create vite@latest`.",
      "`npm run dev` starts a live-reloading development server.",
    ],
    playground: `
function App() {
  const today = new Date().toLocaleDateString();

  return (
    <main>
      <h1>My first React app 🚀</h1>
      <p>Created on {today}</p>
    </main>
  );
}`,
    quiz: [
      { q: "Which tool is recommended for creating a new React project?", options: ["create-react-app", "Vite", "jQuery", "Bootstrap"], answer: 1, why: "Vite is fast, modern and officially supported. create-react-app is deprecated." },
      { q: "Which command starts the development server?", options: ["npm run build", "npm install", "npm run dev", "node start"], answer: 2, why: "`npm run dev` starts the local server with live reload. `build` makes production files." },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    id: "project-anatomy",
    module: "start",
    title: "Anatomy of a React Project",
    minutes: 8,
    summary: "Learn what every file in a new React project does, how they connect, and the correct layout inside a component file.",
    body: [
      ["h", "The folder structure"],
      ["p", "Here is what Vite creates for you. Most of your time is spent inside `src/`."],
      ["tree", `
my-first-app/
├── node_modules/     ← installed packages (never edit by hand)
├── public/           ← static files copied as-is (favicon, robots.txt)
├── src/              ← YOUR code lives here
│   ├── assets/       ← images & icons you import in code
│   ├── App.css       ← styles for the App component
│   ├── App.jsx       ← the main (root) component
│   ├── index.css     ← global styles for the whole app
│   └── main.jsx      ← entry point: puts <App /> on the page
├── index.html        ← the one and only HTML page
├── package.json      ← project name, scripts & dependency list
└── vite.config.js    ← Vite settings`],
      ["h", "How the files connect"],
      ["steps", [
        "The browser loads **index.html**. It contains an empty `<div id=\"root\">` and a script tag pointing to `main.jsx`.",
        "**main.jsx** imports your `App` component and tells React to render it inside `#root`.",
        "**App.jsx** returns the UI. It can include other components, which can include more components, and so on.",
      ]],
      ["code", "html", `
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>`, "index.html"],
      ["code", "jsx", `
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);`, "src/main.jsx"],
      ["analogy", "`index.html` is the empty stage. `main.jsx` is the stage manager who sets things up. `App` is the lead actor, and every other component is a supporting actor."],
      ["tip", "A React app usually has only **one** HTML page. That's why it's called a **Single Page Application (SPA)** — React swaps content inside `#root` instead of loading new pages."],
      ["h", "The correct layout inside a component file"],
      ["p", "Professional React developers keep the same order in every component file. Follow this and your code will always be easy to read:"],
      ["code", "jsx", `
// 1. Imports: libraries first, then your files, then styles
import { useState } from 'react';
import Button from './Button';
import './Counter.css';

// 2. The component (the name starts with a Capital letter)
function Counter({ start = 0 }) {
  // 3. Hooks and state at the top
  const [count, setCount] = useState(start);

  // 4. Event handlers and helper functions
  function handleClick() {
    setCount(count + 1);
  }

  // 5. Return the JSX (what appears on screen)
  return (
    <div className="counter">
      <p>Count: {count}</p>
      <Button onClick={handleClick}>Add one</Button>
    </div>
  );
}

// 6. Export it so other files can use it
export default Counter;`, "src/components/Counter.jsx"],
    ],
    takeaways: [
      "Your code lives in `src/`. Don't touch `node_modules/`.",
      "Flow: `index.html` → `main.jsx` → `App.jsx` → your other components.",
      "Inside a component file: imports → component → hooks → handlers → return JSX → export.",
    ],
    playground: `
import { useState } from 'react';

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

function Counter({ start = 0 }) {
  const [count, setCount] = useState(start);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={handleClick}>Add one</Button>
    </div>
  );
}

function App() {
  return <Counter start={5} />;
}`,
    quiz: [
      { q: "Where should you write most of your React code?", options: ["node_modules/", "public/", "src/", "dist/"], answer: 2, why: "`src/` holds your source code. `node_modules/` is managed by npm and `dist/` is generated by builds." },
      { q: "What does main.jsx do?", options: ["Stores the CSS", "Renders the App component into the #root element", "Lists the project dependencies", "Configures Vite"], answer: 1, why: "`main.jsx` is the entry point: it finds `#root` in index.html and renders `<App />` inside it." },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    id: "jsx",
    module: "core",
    title: "JSX: HTML Inside JavaScript",
    minutes: 8,
    summary: "JSX lets you write HTML-like markup in JavaScript. Learn its 5 simple rules and how to show JavaScript values with curly braces.",
    body: [
      ["h", "What is JSX?"],
      ["p", "JSX lets you write HTML-like markup directly inside JavaScript. It looks like HTML, but behind the scenes it turns into regular JavaScript that creates elements on the page."],
      ["code", "jsx", `
const heading = <h1>Hello, world!</h1>;`],
      ["h", "The 5 rules of JSX"],
      ["steps", [
        "**Return one parent element.** Wrap siblings in a `<div>` or an empty **Fragment** `<>...</>`.",
        "**Close every tag.** Self-closing tags need a slash: `<img />`, `<br />`, `<input />`.",
        "**Use `className` instead of `class`.** (`class` is a reserved word in JavaScript.)",
        "**Use camelCase for attributes:** `onClick`, `htmlFor`, `tabIndex`, `maxLength`.",
        "**Use `{ }` to put JavaScript inside markup.**",
      ]],
      ["compare", {
        left: { label: "Breaks the rules", tone: "bad", lang: "jsx", code: `
function Card() {
  return (
    <h2 class="title">Hello</h2>
    <img src="cat.png">
  );
}` },
        right: { label: "Correct JSX", tone: "good", lang: "jsx", code: `
function Card() {
  return (
    <>
      <h2 className="title">Hello</h2>
      <img src="cat.png" alt="A cat" />
    </>
  );
}` },
      }],
      ["h", "Curly braces: a window into JavaScript"],
      ["analogy", "Think of `{ }` as a window from your markup into JavaScript. Whatever you put inside the window gets calculated first, and the result shows up on the page."],
      ["code", "jsx", `
function Profile() {
  const name = 'Maria';
  const hobbies = ['coding', 'music', 'travel'];

  return (
    <div>
      <h2>Hi, {name}!</h2>
      <p>2 + 2 = {2 + 2}</p>
      <p>You have {hobbies.length} hobbies.</p>
      <p>Your name in caps: {name.toUpperCase()}</p>
    </div>
  );
}`],
      ["warn", "Inside `{ }` you can use **expressions** (anything that produces a value), but not **statements** like `if` or `for`. Lessons 9 and 10 show the React way to do those."],
      ["h", "Inline styles"],
      ["p", "The `style` attribute takes a JavaScript **object**, so you'll see double curly braces. The outer pair is the JavaScript window; the inner pair is the object. CSS property names become camelCase."],
      ["code", "jsx", `
<p style={{ color: 'tomato', fontSize: 24, marginTop: 8 }}>
  Styled text
</p>`],
    ],
    takeaways: [
      "JSX looks like HTML but lives in JavaScript.",
      "One parent element, close all tags, `className`, camelCase attributes.",
      "Use `{ }` to show any JavaScript value or expression.",
    ],
    playground: `
function App() {
  const name = 'Maria';
  const hobbies = ['coding', 'music', 'travel'];

  return (
    <>
      <h2 className="title">Hi, {name}!</h2>
      <p>2 + 2 = {2 + 2}</p>
      <p>You have {hobbies.length} hobbies.</p>
      <p style={{ color: 'tomato', fontSize: 22 }}>
        Your name in caps: {name.toUpperCase()}
      </p>
    </>
  );
}`,
    quiz: [
      { q: "How do you add a CSS class in JSX?", options: ["class=\"box\"", "className=\"box\"", "css=\"box\"", "styleClass=\"box\""], answer: 1, why: "`class` is a reserved JavaScript word, so JSX uses `className`." },
      { q: "What do curly braces { } do in JSX?", options: ["Create a comment", "Insert a JavaScript expression", "Make text bold", "Import a component"], answer: 1, why: "Curly braces open a window into JavaScript so you can show values and expressions." },
      { q: "A component returns an <h1> and a <p> side by side with no wrapper. What happens?", options: ["It works fine", "Error — JSX needs one parent element", "Only the <h1> shows"], answer: 1, why: "JSX must return a single parent. Wrap them in a `<div>` or a Fragment `<>...</>`." },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    id: "components",
    module: "core",
    title: "Components: Building Blocks",
    minutes: 8,
    summary: "A component is a JavaScript function that returns UI. Learn how to create one, reuse it, and build pages from smaller pieces.",
    body: [
      ["h", "A component is just a function"],
      ["code", "jsx", `
function Welcome() {
  return <h1>Welcome to my site!</h1>;
}`],
      ["list", [
        "Its name **must start with a capital letter** (`Welcome`, not `welcome`).",
        "It **returns JSX** — the markup that appears on screen.",
        "Use it like an HTML tag: `<Welcome />`.",
      ]],
      ["h", "Reusing a component"],
      ["code", "jsx", `
function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
      <Welcome />
    </div>
  );
}`],
      ["p", "Write once, use as many times as you want. Change `Welcome` and every copy updates."],
      ["h", "Building pages from components"],
      ["p", "Real apps are a **tree** of components. Big components are made from smaller ones:"],
      ["tree", `
App
├── Header
│   ├── Logo
│   └── NavLink  (×3)
├── ProductList
│   └── ProductCard  (×6)
└── Footer`],
      ["analogy", "It's like folders on your computer: a folder can contain other folders. A component can contain other components."],
      ["code", "jsx", `
function Header() {
  return (
    <header>
      <h1>My Shop</h1>
    </header>
  );
}

function ProductCard() {
  return (
    <article className="card">
      <h3>Coffee Mug</h3>
      <p>$12.00</p>
    </article>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <ProductCard />
        <ProductCard />
      </main>
    </>
  );
}`],
      ["h", "One component per file"],
      ["p", "In a real project each component lives in its own file and is shared with `export` / `import`."],
      ["code", "jsx", `
function Button() {
  return <button className="btn">Click me</button>;
}

export default Button;`, "src/components/Button.jsx"],
      ["code", "jsx", `
import Button from './components/Button';

function App() {
  return <Button />;
}

export default App;`, "src/App.jsx"],
      ["compare", {
        left: { label: "Lowercase name", tone: "bad", lang: "jsx", code: `
function button() {
  return <button>Hi</button>;
}

// React thinks <button /> is the
// plain HTML tag, not yours!` },
        right: { label: "Capitalized name", tone: "good", lang: "jsx", code: `
function MyButton() {
  return <button>Hi</button>;
}

// <MyButton /> is clearly
// your component.` },
      }],
      ["tip", "If a chunk of JSX gets long, or you copy-paste it more than twice, that's a sign it should become its own component."],
    ],
    takeaways: [
      "A component is a capitalized function that returns JSX.",
      "Components can be reused and nested inside each other to build whole pages.",
      "Keep one component per file and share it with `export default` / `import`.",
    ],
    playground: `
function Header() {
  return (
    <header style={{ borderBottom: '1px solid #ddd', marginBottom: 16 }}>
      <h1>My Shop 🛍️</h1>
    </header>
  );
}

function ProductCard() {
  return (
    <article style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <h3 style={{ margin: 0 }}>Coffee Mug</h3>
      <p style={{ margin: '4px 0 0' }}>$12.00</p>
    </article>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </main>
    </>
  );
}`,
    quiz: [
      { q: "Which is a valid component name?", options: ["productCard", "product-card", "ProductCard", "_productCard"], answer: 2, why: "Component names must start with a capital letter. PascalCase like `ProductCard` is the convention." },
      { q: "What does a component return?", options: ["A CSS string", "JSX (the UI to show)", "A number", "Nothing"], answer: 1, why: "A component returns JSX describing what should appear on screen (or `null` to show nothing)." },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    id: "props",
    module: "core",
    title: "Props: Passing Data",
    minutes: 9,
    summary: "Props let a parent component send data to a child, so one component can show different content each time it's used.",
    body: [
      ["h", "Props are inputs"],
      ["p", "**Props** (short for \"properties\") let a parent component pass data down to a child component — exactly like passing arguments to a function."],
      ["analogy", "A component is like a coffee machine, and props are the buttons you press: size, sugar, milk. Same machine, different coffee every time."],
      ["code", "jsx", `
function Greeting(props) {
  return <h2>Hello, {props.name}!</h2>;
}

function App() {
  return (
    <>
      <Greeting name="Ana" />
      <Greeting name="Ben" />
      <Greeting name="Chloe" />
    </>
  );
}`],
      ["h", "Destructuring: the cleaner way"],
      ["p", "Instead of writing `props.name` everywhere, most developers unpack (destructure) the props right in the function's parentheses:"],
      ["code", "jsx", `
function Greeting({ name, age }) {
  return <h2>Hello, {name}! You are {age}.</h2>;
}

<Greeting name="Ana" age={28} />`],
      ["h", "Passing different types of data"],
      ["p", "Strings go in quotes. **Everything else** goes in curly braces."],
      ["code", "jsx", `
<UserCard
  name="Ana"               // string
  age={28}                 // number
  isAdmin={true}           // boolean
  skills={['JS', 'CSS']}   // array
  address={{ city: 'Paris' }} // object
  onSelect={handleSelect}  // function
/>`],
      ["h", "Default values"],
      ["code", "jsx", `
function Button({ label = 'Click me', color = 'blue' }) {
  return <button style={{ background: color }}>{label}</button>;
}

<Button />                 // uses the defaults
<Button label="Save" />    // custom label, default color`],
      ["h", "The special children prop"],
      ["p", "Anything you put **between** a component's opening and closing tags arrives as `children`. It's perfect for wrapper components like cards and modals."],
      ["code", "jsx", `
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h3>Any content</h3>
  <p>goes right here.</p>
</Card>`],
      ["h", "Data flows one way: down"],
      ["p", "Data always flows **down** the tree, from parent to child — like water flowing downhill."],
      ["tree", `
App            ← owns the data: user = { name: 'Ana' }
└── Profile    ← receives user as a prop
    └── Avatar ← receives user.name as a prop`],
      ["warn", "Props are **read-only**. A component must never change its own props. If data needs to change, use **state** (next lesson)."],
    ],
    takeaways: [
      "Props pass data from parent to child, like function arguments.",
      "Strings use quotes; numbers, booleans, arrays, objects and functions use `{ }`.",
      "`children` is whatever you put between a component's tags.",
      "Props are read-only and flow one way: down.",
    ],
    playground: `
function ProfileCard({ name, role, emoji = '🙂', children }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ fontSize: 32 }}>{emoji}</div>
      <h3 style={{ margin: '8px 0 0' }}>{name}</h3>
      <p style={{ margin: '0 0 8px', color: '#666' }}>{role}</p>
      {children}
    </div>
  );
}

function App() {
  return (
    <>
      <ProfileCard name="Ana" role="Frontend Developer" emoji="👩‍💻">
        <p>Loves React and coffee.</p>
      </ProfileCard>
      <ProfileCard name="Ben" role="Designer" emoji="🎨" />
      <ProfileCard name="Chloe" role="Student" />
    </>
  );
}`,
    quiz: [
      { q: "How do you pass the number 28 as a prop?", options: ["age=\"28\"", "age={28}", "age=28", "age:{28}"], answer: 1, why: "Non-string values go inside curly braces. `age=\"28\"` would pass the text \"28\", not a number." },
      { q: "Can a component change its own props?", options: ["Yes, any time", "Only inside useEffect", "No — props are read-only"], answer: 2, why: "Props are read-only. For data that changes, use state." },
      { q: "What is the children prop?", options: ["A list of child components in the project", "The content placed between a component's opening and closing tags", "A prop for numbers only"], answer: 1, why: "`children` contains whatever JSX you nest inside `<Card>...</Card>`." },
    ],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    id: "state",
    module: "core",
    title: "State: Component Memory",
    minutes: 10,
    summary: "State is data a component remembers that can change over time. When state changes, React updates the screen automatically.",
    body: [
      ["h", "What is state?"],
      ["p", "**State** is a component's memory. It's data that can change while the app is running: a counter value, whether a menu is open, what someone typed in a search box."],
      ["analogy", "Props are like your name — given to you by your parents and you don't change it yourself. State is like your mood — it's yours, and it changes over time."],
      ["h", "Why not use a normal variable?"],
      ["compare", {
        left: { label: "Normal variable", tone: "bad", lang: "jsx", code: `
function Counter() {
  let count = 0;

  return (
    <button onClick={() => { count = count + 1; }}>
      Clicked {count} times
    </button>
  );
}
// The number never changes on screen!` },
        right: { label: "useState", tone: "good", lang: "jsx", code: `
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
// Updates every click` },
      }],
      ["p", "A normal variable resets every time the component runs, and React doesn't know it changed. `useState` gives you a value React **remembers**, plus a setter function that tells React to **re-render**."],
      ["h", "Anatomy of useState"],
      ["code", "jsx", `
import { useState } from 'react';

const [count, setCount] = useState(0);
//      ▲         ▲                ▲
//   current   function to      starting
//    value    update it         value`],
      ["h", "What happens when state changes"],
      ["steps", [
        "The user clicks the button.",
        "Your code calls `setCount(1)`.",
        "React runs your component function again (a **re-render**) with the new value.",
        "React compares the new JSX with the old one and updates **only the parts of the page that changed**.",
      ]],
      ["h", "State can hold any type"],
      ["code", "jsx", `
const [name, setName] = useState('');          // text
const [isOpen, setIsOpen] = useState(false);   // true / false
const [items, setItems] = useState([]);        // array
const [user, setUser] = useState({ name: 'Ana', age: 28 }); // object

setIsOpen(!isOpen);                      // toggle
setItems([...items, 'New item']);        // add to an array
setUser({ ...user, age: 29 });           // update one field`],
      ["warn", "Never change state directly, like `user.age = 29` or `items.push(x)`. React won't notice. Always pass a **new** value to the setter, using the spread operator `...` to copy the old one."],
      ["tip", "When the new value depends on the old one, use the function form: `setCount(prev => prev + 1)`. It's always safe, even when several updates happen quickly."],
      ["h", "The rules of Hooks"],
      ["list", [
        "Only call hooks at the **top level** of your component — never inside `if` statements, loops or nested functions.",
        "Only call hooks inside **React components** (or your own custom hooks).",
        "Hook names always start with `use`.",
      ]],
    ],
    takeaways: [
      "State is a component's memory for data that changes.",
      "`const [value, setValue] = useState(initial)` — read the value, update it with the setter.",
      "Calling the setter re-renders the component with the new value.",
      "Never mutate state directly; always give the setter a new value.",
    ],
    playground: `
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  const box = {
    padding: 24,
    borderRadius: 16,
    background: isDark ? '#16202c' : '#f2f5f9',
    color: isDark ? '#fff' : '#16202c',
  };

  return (
    <div style={box}>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>+1</button>{' '}
      <button onClick={() => setCount(count - 1)}>-1</button>{' '}
      <button onClick={() => setCount(0)}>Reset</button>
      <hr />
      <button onClick={() => setIsDark(!isDark)}>
        Switch to {isDark ? 'light' : 'dark'} mode
      </button>
    </div>
  );
}`,
    quiz: [
      { q: "What does useState return?", options: ["Only the current value", "An array: [current value, setter function]", "A promise", "A new component"], answer: 1, why: "`useState` returns a pair, which we unpack: `const [count, setCount] = useState(0)`." },
      { q: "You have state `todos` (an array). How do you add an item correctly?", options: ["todos.push(item)", "setTodos([...todos, item])", "todos = [...todos, item]"], answer: 1, why: "Create a new array with spread and pass it to the setter. `push` mutates the old array and React won't re-render." },
      { q: "Where can you call useState?", options: ["Inside an if statement", "Inside a for loop", "At the top level of a component"], answer: 2, why: "Hooks must be called at the top level of a component, in the same order every render." },
    ],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    id: "events",
    module: "core",
    title: "Handling Events",
    minutes: 7,
    summary: "Make your app respond to clicks, typing and form submits by attaching functions to event props like onClick.",
    body: [
      ["h", "Responding to the user"],
      ["p", "**Events** are things the user does: click, type, hover, submit a form. In React you attach a function to an event using props like `onClick`."],
      ["code", "jsx", `
function AlertButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return <button onClick={handleClick}>Click me</button>;
}`],
      ["h", "The #1 beginner mistake"],
      ["compare", {
        left: { label: "Calls it immediately", tone: "bad", lang: "jsx", code: `
<button onClick={handleClick()}>
  Click me
</button>

// handleClick runs while rendering,
// not when the user clicks!` },
        right: { label: "Passes the function", tone: "good", lang: "jsx", code: `
<button onClick={handleClick}>
  Click me
</button>

// Need an argument? Wrap it:
<button onClick={() => handleDelete(id)}>
  Delete
</button>` },
      }],
      ["p", "Give React the **function itself** (no parentheses). React will call it later, when the event happens."],
      ["h", "Common events"],
      ["table", ["Event", "Fires when…"], [
        ["onClick", "An element is clicked or tapped."],
        ["onChange", "An input, select or textarea value changes."],
        ["onSubmit", "A form is submitted (Enter key or submit button)."],
        ["onKeyDown", "A key is pressed."],
        ["onMouseEnter / onMouseLeave", "The mouse moves over / out of an element."],
        ["onFocus / onBlur", "An input gains / loses focus."],
      ]],
      ["h", "The event object"],
      ["p", "React passes an **event object** to your handler. Two things you'll use constantly:"],
      ["code", "jsx", `
function SearchBox() {
  function handleChange(event) {
    console.log(event.target.value); // what the user typed
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the page from reloading
    console.log('Form submitted!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} placeholder="Search..." />
      <button type="submit">Go</button>
    </form>
  );
}`],
      ["h", "Passing handlers as props"],
      ["p", "A parent can pass a function to a child, so the child can tell the parent \"something happened\"."],
      ["code", "jsx", `
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

function App() {
  function handleSave() {
    alert('Saved!');
  }

  return <Button onClick={handleSave}>Save</Button>;
}`],
      ["tip", "Naming convention: name your functions `handleSomething` (like `handleSave`) and the props that receive them `onSomething` (like `onSave`)."],
    ],
    takeaways: [
      "Attach handlers with camelCase props: `onClick`, `onChange`, `onSubmit`.",
      "Pass the function, don't call it: `onClick={handleClick}`.",
      "`event.target.value` reads input text; `event.preventDefault()` stops form reloads.",
    ],
    playground: `
import { useState } from 'react';

const COLORS = ['#087ea4', '#7c3aed', '#e11d48', '#15803d', '#ea580c'];

function App() {
  const [color, setColor] = useState(COLORS[0]);
  const [clicks, setClicks] = useState(0);

  function handlePick(newColor) {
    setColor(newColor);
    setClicks(clicks + 1);
    console.log('Picked', newColor);
  }

  return (
    <div>
      <h2 style={{ color }}>Pick a color!</h2>
      {COLORS.map((c) => (
        <button
          key={c}
          onClick={() => handlePick(c)}
          style={{ background: c, color: '#fff', border: 0, padding: '8px 14px', marginRight: 6, borderRadius: 8 }}
        >
          {c}
        </button>
      ))}
      <p>You changed the color {clicks} times.</p>
    </div>
  );
}`,
    quiz: [
      { q: "Which line correctly runs handleClick when the button is clicked?", options: ["onClick={handleClick()}", "onClick={handleClick}", "onclick=\"handleClick\"", "onClick=handleClick"], answer: 1, why: "Pass the function itself. With `()`, it runs immediately during render." },
      { q: "How do you stop a form from reloading the page?", options: ["return false", "event.preventDefault()", "event.stop()", "form.reload = false"], answer: 1, why: "Call `event.preventDefault()` at the start of your submit handler." },
    ],
  },

  /* ------------------------------------------------------------------ 9 */
  {
    id: "conditional-rendering",
    module: "ui",
    title: "Conditional Rendering",
    minutes: 7,
    summary: "Show different UI depending on your data using if statements, the ternary operator, and the && shortcut.",
    body: [
      ["h", "Showing different things"],
      ["p", "Apps constantly show different UI based on data: logged in or not, loading or loaded, empty list or full list. Here are the four ways to do it."],
      ["h", "1. if / else (before the return)"],
      ["code", "jsx", `
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h2>Welcome back! 👋</h2>;
  }
  return <h2>Please sign in.</h2>;
}`],
      ["h", "2. Ternary operator: condition ? A : B"],
      ["p", "Perfect for choosing between two options **inside** your JSX."],
      ["code", "jsx", `
function Navbar({ isLoggedIn }) {
  return (
    <nav>
      <a href="/">Home</a>
      {isLoggedIn ? <button>Log out</button> : <button>Log in</button>}
    </nav>
  );
}`],
      ["h", "3. Logical &&: show it or show nothing"],
      ["code", "jsx", `
function Inbox({ unread }) {
  return (
    <div>
      <h2>Inbox</h2>
      {unread > 0 && <p>You have {unread} new messages!</p>}
    </div>
  );
}`],
      ["analogy", "Read `condition && <Thing />` as \"**if** condition is true, **then** show Thing\"."],
      ["warn", "Be careful with numbers: `{count && <p>…</p>}` displays a **0** on the page when count is 0. Use a real true/false check like `{count > 0 && <p>…</p>}`."],
      ["h", "4. Return null to hide a component"],
      ["code", "jsx", `
function Banner({ show }) {
  if (!show) return null; // render nothing
  return <div className="banner">Big sale today!</div>;
}`],
      ["h", "Which one should I use?"],
      ["table", ["Situation", "Use"], [
        ["Completely different output", "`if` / `else` before the return"],
        ["Choose between two pieces of JSX", "Ternary `a ? b : c`"],
        ["Show something or nothing", "`condition && <Thing />`"],
        ["Hide a whole component", "`return null`"],
      ]],
    ],
    takeaways: [
      "Use `if` for big differences, ternaries for either/or, `&&` for show/hide.",
      "Avoid `{number && ...}` — compare explicitly, like `{number > 0 && ...}`.",
      "Returning `null` renders nothing.",
    ],
    playground: `
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unread, setUnread] = useState(3);

  return (
    <div>
      {isLoggedIn ? <h2>Welcome back, Ana! 👋</h2> : <h2>Please sign in.</h2>}

      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Log out' : 'Log in'}
      </button>

      {isLoggedIn && (
        <section>
          {unread > 0 ? (
            <p>📬 You have {unread} unread messages.</p>
          ) : (
            <p>✅ All caught up!</p>
          )}
          <button onClick={() => setUnread(0)}>Mark all as read</button>
        </section>
      )}
    </div>
  );
}`,
    quiz: [
      { q: "count is 0. What does {count && <p>Items</p>} display?", options: ["Nothing", "0", "Items", "An error"], answer: 1, why: "`0 && ...` evaluates to `0`, and React renders the number 0. Use `count > 0 && ...`." },
      { q: "What should a component return to render nothing?", options: ["undefined", "false", "null", "an empty string"], answer: 2, why: "Returning `null` is the clear, standard way to render nothing." },
    ],
  },

  /* ------------------------------------------------------------------ 10 */
  {
    id: "lists-and-keys",
    module: "ui",
    title: "Lists & Keys",
    minutes: 8,
    summary: "Turn arrays of data into UI with map(), and learn why every list item needs a unique key.",
    body: [
      ["h", "From array to UI with map()"],
      ["p", "`map()` goes through every item in an array and turns it into something new. In React, we turn each item into JSX."],
      ["code", "jsx", `
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Cherry'];

  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}`],
      ["h", "Lists of objects (the real-world case)"],
      ["p", "Data from an API usually arrives as an array of objects, each with an `id`:"],
      ["code", "jsx", `
const products = [
  { id: 1, name: 'Mug', price: 12 },
  { id: 2, name: 'T-shirt', price: 25 },
  { id: 3, name: 'Cap', price: 18 },
];

function ProductList() {
  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
        />
      ))}
    </div>
  );
}`],
      ["h", "Why keys matter"],
      ["analogy", "Keys are like name tags at a party. If people move around, React uses the name tags to know who is who — instead of guessing by position."],
      ["p", "Without good keys, React can mix up items when the list is sorted, filtered, or has items added or removed. Typed text can end up in the wrong row, for example."],
      ["compare", {
        left: { label: "Risky keys", tone: "bad", lang: "jsx", code: `
// No key: React shows a warning
{todos.map((todo) => <li>{todo.text}</li>)}

// Index: breaks when list reorders
{todos.map((todo, i) => <li key={i}>{todo.text}</li>)}

// Random: new key every render!
<li key={Math.random()}>...</li>` },
        right: { label: "Stable unique id", tone: "good", lang: "jsx", code: `
{todos.map((todo) => (
  <li key={todo.id}>{todo.text}</li>
))}

// Need new ids? Create them
// when the item is created:
const newTodo = {
  id: crypto.randomUUID(),
  text: 'Learn keys',
};` },
      }],
      ["list", [
        "Keys must be **unique** among siblings.",
        "Keys must be **stable** — the same item keeps the same key every render.",
        "The `key` goes on the **outermost** element returned from `map()`.",
      ]],
      ["h", "Filter, then map"],
      ["code", "jsx", `
const cheap = products
  .filter((p) => p.price < 20)
  .map((p) => <li key={p.id}>{p.name}</li>);`],
    ],
    takeaways: [
      "Use `array.map()` to turn data into a list of JSX elements.",
      "Every item needs a unique, stable `key` — ideally an id from your data.",
      "Avoid index keys if the list can change order, and never use random keys.",
    ],
    playground: `
import { useState } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Coffee Mug', price: 12, category: 'home' },
  { id: 2, name: 'T-shirt', price: 25, category: 'clothes' },
  { id: 3, name: 'Cap', price: 18, category: 'clothes' },
  { id: 4, name: 'Plant Pot', price: 9, category: 'home' },
  { id: 5, name: 'Hoodie', price: 45, category: 'clothes' },
];

function App() {
  const [filter, setFilter] = useState('all');

  const visible = PRODUCTS.filter(
    (p) => filter === 'all' || p.category === filter
  );

  return (
    <div>
      <h2>Shop ({visible.length} items)</h2>
      {['all', 'home', 'clothes'].map((f) => (
        <button key={f} onClick={() => setFilter(f)} disabled={filter === f}>
          {f}
        </button>
      ))}
      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            {p.name} — <strong>\${p.price}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    quiz: [
      { q: "Which is the best key for a list of users from an API?", options: ["The array index", "Math.random()", "user.id", "The string \"user\""], answer: 2, why: "A unique, stable id from your data is the ideal key." },
      { q: "Which array method turns data into a list of JSX elements?", options: ["forEach()", "map()", "push()", "find()"], answer: 1, why: "`map()` returns a new array — of JSX elements in this case. `forEach()` returns nothing." },
    ],
  },

  /* ------------------------------------------------------------------ 11 */
  {
    id: "forms",
    module: "ui",
    title: "Forms & Controlled Inputs",
    minutes: 9,
    summary: "Handle text inputs, checkboxes and selects the React way by keeping their values in state.",
    body: [
      ["h", "Controlled inputs"],
      ["p", "In React, the standard way to handle a form field is to keep its value in **state**. The input displays the state, and every keystroke updates the state. This is called a **controlled input**."],
      ["analogy", "State is the scoreboard — the single source of truth. The input just displays what's on the scoreboard, and each keystroke updates the scoreboard."],
      ["code", "jsx", `
function NameInput() {
  const [name, setName] = useState('');

  return (
    <>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </>
  );
}`],
      ["h", "A complete form"],
      ["p", "For forms with several fields, keep one state object and use each input's `name` attribute to update the right field:"],
      ["code", "jsx", `
function SignupForm() {
  const [form, setForm] = useState({ email: '', password: '', agree: false });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Sending:', form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email"
        value={form.email} onChange={handleChange} />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password"
        value={form.password} onChange={handleChange} />

      <label>
        <input name="agree" type="checkbox"
          checked={form.agree} onChange={handleChange} />
        I agree to the terms
      </label>

      <button type="submit">Sign up</button>
    </form>
  );
}`],
      ["h", "Cheat sheet for form elements"],
      ["table", ["Element", "Read with", "Set with"], [
        ["<input type=\"text\">", "e.target.value", "value={...}"],
        ["<textarea>", "e.target.value", "value={...}"],
        ["<select>", "e.target.value", "value={...}"],
        ["<input type=\"checkbox\">", "e.target.checked", "checked={...}"],
      ]],
      ["tip", "Always connect a `<label>` to its input with `htmlFor` and `id`. Clicking the label focuses the input, and screen readers can read it."],
      ["h", "Simple validation"],
      ["code", "jsx", `
const isEmailValid = form.email.includes('@');
const canSubmit = isEmailValid && form.password.length >= 8 && form.agree;

<button type="submit" disabled={!canSubmit}>Sign up</button>
{!isEmailValid && form.email && <p className="error">Enter a valid email.</p>}`],
      ["note", "Notice that `isEmailValid` is a normal variable calculated from state — not more state. If you can **calculate** something from existing state, don't store it separately."],
    ],
    takeaways: [
      "Controlled input = `value` from state + `onChange` that updates state.",
      "Use one state object and `[name]` to handle many fields with one function.",
      "Checkboxes use `checked`; everything else uses `value`.",
      "Calculate derived values (like validation) instead of storing them in state.",
    ],
    playground: `
import { useState } from 'react';

function App() {
  const [form, setForm] = useState({ name: '', email: '', level: 'beginner', agree: false });
  const [sent, setSent] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(form);
  }

  const canSubmit = form.name && form.email.includes('@') && form.agree;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, maxWidth: 320 }}>
      <label>Name <input name="name" value={form.name} onChange={handleChange} /></label>
      <label>Email <input name="email" type="email" value={form.email} onChange={handleChange} /></label>
      <label>
        Level{' '}
        <select name="level" value={form.level} onChange={handleChange}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
        </select>
      </label>
      <label>
        <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} /> I agree
      </label>
      <button type="submit" disabled={!canSubmit}>Join the course</button>
      {sent && <p>🎉 Welcome, {sent.name}! ({sent.level})</p>}
    </form>
  );
}`,
    quiz: [
      { q: "What makes an input \"controlled\"?", options: ["It has a CSS class", "Its value comes from state and onChange updates that state", "It is inside a <form>", "It uses useEffect"], answer: 1, why: "A controlled input gets `value` from state and updates the state in `onChange`." },
      { q: "How do you read whether a checkbox is ticked?", options: ["e.target.value", "e.target.checked", "e.checked", "e.target.ticked"], answer: 1, why: "Checkboxes use `e.target.checked`, which is `true` or `false`." },
    ],
  },

  /* ------------------------------------------------------------------ 12 */
  {
    id: "lifting-state",
    module: "ui",
    title: "Sharing State Between Components",
    minutes: 8,
    summary: "When two components need the same data, move the state up to their closest common parent and pass it down as props.",
    body: [
      ["h", "The problem"],
      ["p", "Imagine a search bar and a results list sitting side by side. The results need to know what was typed in the search bar. But sibling components **can't talk to each other directly**."],
      ["h", "The solution: lift state up"],
      ["p", "Move the state to the **closest common parent**. The parent passes the value down to whoever needs to read it, and passes a function down to whoever needs to change it."],
      ["analogy", "Two kids want to share a toy. Instead of fighting over it, a parent holds the toy and decides who gets to use it."],
      ["tree", `
App               ← state lives here: [query, setQuery]
├── SearchBar     ← gets query + onSearch (to change it)
└── ResultsList   ← gets query (to filter results)`],
      ["code", "jsx", `
function SearchBar({ query, onSearch }) {
  return (
    <input
      value={query}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search fruits..."
    />
  );
}

function ResultsList({ query }) {
  const fruits = ['Apple', 'Banana', 'Cherry', 'Mango'];
  const results = fruits.filter((f) =>
    f.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ul>
      {results.map((f) => <li key={f}>{f}</li>)}
    </ul>
  );
}

function App() {
  const [query, setQuery] = useState(''); // lifted up!

  return (
    <>
      <SearchBar query={query} onSearch={setQuery} />
      <ResultsList query={query} />
    </>
  );
}`],
      ["h", "How to lift state, step by step"],
      ["steps", [
        "Find every component that needs the data.",
        "Find their **closest common parent**.",
        "Put the `useState` in that parent.",
        "Pass the **value** down as a prop to components that read it.",
        "Pass a **function** down as a prop to components that change it.",
      ]],
      ["h", "Thinking in React"],
      ["p", "This is how experienced developers plan any new screen:"],
      ["steps", [
        "**Break the design into components.** Draw boxes around each piece of the UI.",
        "**Build a static version first** with hard-coded data and props — no state yet.",
        "**Find the minimal state.** What changes over time? What can be calculated instead?",
        "**Decide where each piece of state lives** — the closest common parent of everything that uses it.",
        "**Add the event handlers** that let children update the parent's state.",
      ]],
      ["tip", "Keep state as **low** in the tree as possible, and only lift it when another component actually needs it."],
    ],
    takeaways: [
      "Sibling components share data through their common parent.",
      "Parents pass values down, and pass functions down so children can request changes.",
      "Plan screens with \"Thinking in React\": components → static → state → where it lives → events.",
    ],
    playground: `
import { useState } from 'react';

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Mango', 'Orange'];

function SearchBar({ query, onSearch }) {
  return (
    <input
      value={query}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search fruits..."
      style={{ padding: 8, width: '100%', maxWidth: 280 }}
    />
  );
}

function ResultsList({ query }) {
  const results = FRUITS.filter((f) =>
    f.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length === 0) return <p>No fruits found 🍂</p>;

  return (
    <ul>
      {results.map((f) => <li key={f}>{f}</li>)}
    </ul>
  );
}

function App() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <h2>Fruit finder</h2>
      <SearchBar query={query} onSearch={setQuery} />
      <ResultsList query={query} />
    </div>
  );
}`,
    quiz: [
      { q: "Two sibling components need the same state. Where should it live?", options: ["In both siblings", "In their closest common parent", "In a global variable", "In the first sibling only"], answer: 1, why: "Lift state to the closest common parent, then pass it down as props." },
      { q: "How can a child component change state that lives in its parent?", options: ["Edit its props directly", "Call a function the parent passed down as a prop", "It can't, ever"], answer: 1, why: "The parent passes a function (like `onSearch`) down; the child calls it to request the change." },
    ],
  },

  /* ------------------------------------------------------------------ 13 */
  {
    id: "use-effect",
    module: "beyond",
    title: "useEffect: Side Effects",
    minutes: 10,
    summary: "Run code after rendering — fetching data, timers, page titles — and learn how the dependency array controls when it runs.",
    body: [
      ["h", "What is a side effect?"],
      ["p", "A component's main job is to calculate JSX. Anything that reaches **outside** the component is a **side effect**: fetching data from a server, starting a timer, changing the page title, listening to window events. `useEffect` is where those go."],
      ["code", "jsx", `
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = 'Clicked ' + count + ' times';
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Click</button>;
}`],
      ["h", "The dependency array controls when it runs"],
      ["table", ["You write", "The effect runs…"], [
        ["useEffect(fn)", "After **every** render (rarely what you want)."],
        ["useEffect(fn, [])", "**Once**, after the first render."],
        ["useEffect(fn, [a, b])", "After the first render, and again whenever `a` or `b` changes."],
      ]],
      ["h", "Fetching data"],
      ["code", "jsx", `
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setError('Could not load users.'))
      .finally(() => setLoading(false));
  }, []); // [] = run once

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {users.map((u) => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}`],
      ["tip", "Always handle three states when loading data: **loading**, **error** and **success**. Your users will thank you."],
      ["h", "Cleaning up"],
      ["p", "If your effect starts something that keeps running (a timer, an event listener), return a **cleanup function** that stops it."],
      ["code", "jsx", `
useEffect(() => {
  const id = setInterval(() => {
    setSeconds((s) => s + 1);
  }, 1000);

  return () => clearInterval(id); // cleanup
}, []);`],
      ["analogy", "Cleanup is like turning off the lights when you leave a room. If you switched something on, switch it off when the component goes away."],
      ["warn", "Infinite loop alert: if an effect sets state and has **no** dependency array, it re-renders, runs again, sets state again… forever. Always include the dependency array."],
      ["note", "In development, React's StrictMode runs your effects **twice** on purpose to help you find missing cleanups. This doesn't happen in production."],
      ["tip", "You might not need an effect! If you can calculate something from props or state while rendering, just calculate it. Effects are for syncing with things **outside** React."],
    ],
    takeaways: [
      "`useEffect` runs code after render — for data fetching, timers, subscriptions and the document title.",
      "`[]` = run once. `[value]` = run when value changes. No array = every render.",
      "Return a cleanup function to stop timers and listeners.",
    ],
    playground: `
import { useState, useEffect } from 'react';

function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    console.log('Timer started');
    return () => {
      clearInterval(id);
      console.log('Timer cleaned up');
    };
  }, [running]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: 56, margin: 0 }}>⏱️ {seconds}s</h1>
      <button onClick={() => setRunning(!running)}>
        {running ? 'Pause' : 'Start'}
      </button>{' '}
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}`,
    quiz: [
      { q: "How do you run an effect only once, after the first render?", options: ["useEffect(fn)", "useEffect(fn, [])", "useEffect(fn, [once])", "useOnce(fn)"], answer: 1, why: "An empty dependency array means there's nothing to watch, so it runs only once." },
      { q: "Why return a function from useEffect?", options: ["To return JSX", "To clean up timers or listeners", "To make it run faster", "It's required for every effect"], answer: 1, why: "The returned cleanup function runs before the effect re-runs and when the component is removed." },
    ],
  },

  /* ------------------------------------------------------------------ 14 */
  {
    id: "styling",
    module: "beyond",
    title: "Styling React Apps",
    minutes: 7,
    summary: "Compare the popular ways to style React components — plain CSS, CSS Modules, inline styles and Tailwind — and when to use each.",
    body: [
      ["h", "Your options at a glance"],
      ["table", ["Approach", "Good for", "Watch out for"], [
        ["Plain CSS file", "Beginners and small apps", "Class names can clash across files"],
        ["CSS Modules", "Most projects — styles stay local to one component", "Slightly different syntax"],
        ["Inline styles", "Quick dynamic values (like a width %)", "No hover, media queries or animations"],
        ["Tailwind CSS", "Fast building with utility classes", "Long class lists; a new syntax to learn"],
      ]],
      ["h", "1. Plain CSS"],
      ["code", "css", `
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  background: #087ea4;
  color: white;
}`, "Button.css"],
      ["code", "jsx", `
import './Button.css';

function Button({ children }) {
  return <button className="btn">{children}</button>;
}`, "Button.jsx"],
      ["h", "2. CSS Modules (recommended)"],
      ["p", "Name the file `Something.module.css`. Vite automatically makes every class name unique, so styles never leak into other components."],
      ["code", "css", `
.primary {
  background: #087ea4;
  color: white;
}`, "Button.module.css"],
      ["code", "jsx", `
import styles from './Button.module.css';

function Button({ children }) {
  return <button className={styles.primary}>{children}</button>;
}`, "Button.jsx"],
      ["h", "3. Inline styles"],
      ["code", "jsx", `
function ProgressBar({ percent }) {
  return (
    <div style={{ background: '#eee', borderRadius: 8 }}>
      <div style={{ width: percent + '%', height: 8, background: '#087ea4' }} />
    </div>
  );
}`],
      ["h", "Conditional class names"],
      ["p", "A very common pattern: add a class only when something is true."],
      ["code", "jsx", `
<button className={\`tab \${isActive ? 'tab--active' : ''}\`}>
  Profile
</button>`],
      ["tip", "Start with plain CSS or CSS Modules. Once you're comfortable, try Tailwind CSS — many teams use it, so it's a great skill for your portfolio."],
      ["h", "Naming your classes: BEM"],
      ["p", "**BEM** (Block, Element, Modifier) keeps class names predictable: `card` (block), `card__title` (element inside it), `card--featured` (a variation)."],
      ["code", "css", `
.card { }            /* Block */
.card__title { }     /* Element inside the block */
.card--featured { }  /* Modifier: a variation */`],
    ],
    takeaways: [
      "Import CSS files directly into components and use `className`.",
      "CSS Modules (`.module.css`) keep styles scoped to one component.",
      "Use inline styles for dynamic values and template strings for conditional classes.",
    ],
    playground: `
import { useState } from 'react';

function Card({ title, featured, children }) {
  const style = {
    padding: 20,
    borderRadius: 14,
    marginBottom: 12,
    border: featured ? '2px solid #7c3aed' : '1px solid #ddd',
    background: featured ? '#f5f0ff' : '#fff',
    transition: 'all .2s',
  };

  return (
    <div style={style}>
      <h3 style={{ margin: '0 0 6px' }}>{featured && '⭐ '}{title}</h3>
      {children}
    </div>
  );
}

function App() {
  const [featured, setFeatured] = useState(true);

  return (
    <div>
      <button onClick={() => setFeatured(!featured)}>Toggle featured</button>
      <br /><br />
      <Card title="React Basics" featured={featured}>
        <p style={{ margin: 0 }}>Styles change based on props.</p>
      </Card>
      <Card title="Advanced Hooks">
        <p style={{ margin: 0 }}>A normal card.</p>
      </Card>
    </div>
  );
}`,
    quiz: [
      { q: "What's the main benefit of CSS Modules?", options: ["They make CSS load faster", "Class names are scoped to one component, so they never clash", "They replace JavaScript", "They support only inline styles"], answer: 1, why: "CSS Modules make every class name unique, so styles stay local to the component that imports them." },
      { q: "How do you write font-size in a React inline style?", options: ["{ font-size: 16 }", "{ fontSize: 16 }", "{ FontSize: 16 }", "\"font-size: 16px\""], answer: 1, why: "Inline style objects use camelCase property names: `fontSize`." },
    ],
  },

  /* ------------------------------------------------------------------ 15 */
  {
    id: "folder-structure",
    module: "beyond",
    title: "Organizing a Real Project",
    minutes: 10,
    summary: "The professional folder structure, naming conventions and page layout used in real-world React projects.",
    body: [
      ["h", "Start simple"],
      ["p", "For small apps, a flat `components/` folder is perfectly fine. Don't over-organize on day one."],
      ["tree", `
src/
├── components/
│   ├── Header.jsx
│   ├── TodoItem.jsx
│   └── TodoList.jsx
├── App.jsx
├── App.css
└── main.jsx`],
      ["h", "The structure for growing projects"],
      ["p", "As your app grows, group files by **what they do**. This is a widely used structure you'll see in many companies:"],
      ["tree", `
src/
├── assets/            ← images, fonts, icons
├── components/        ← reusable UI pieces used everywhere
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.module.css
│   └── Navbar/
│       ├── Navbar.jsx
│       └── Navbar.module.css
├── pages/             ← full screens: Home, About, Dashboard
│   ├── Home.jsx
│   └── About.jsx
├── layouts/           ← shared page frames (header + footer)
│   └── MainLayout.jsx
├── hooks/             ← custom hooks: useFetch, useLocalStorage
├── services/          ← code that talks to APIs
│   └── api.js
├── utils/             ← small helper functions: formatDate.js
├── context/           ← global state: ThemeContext.jsx
├── App.jsx
└── main.jsx`],
      ["table", ["Folder", "Put here", "Example"], [
        ["components/", "Small, reusable UI pieces", "Button, Modal, Card"],
        ["pages/", "One component per screen / route", "Home, Profile, Checkout"],
        ["layouts/", "Frames that wrap pages", "MainLayout, AuthLayout"],
        ["hooks/", "Reusable logic with hooks", "useFetch, useToggle"],
        ["services/", "API calls and external services", "api.js, authService.js"],
        ["utils/", "Pure helper functions (no React)", "formatPrice.js"],
      ]],
      ["h", "Naming conventions"],
      ["table", ["What", "Convention", "Example"], [
        ["Components", "PascalCase", "ProductCard.jsx"],
        ["Hooks", "camelCase, starts with use", "useCart.js"],
        ["Utilities", "camelCase", "formatPrice.js"],
        ["CSS Modules", "Same name as component", "ProductCard.module.css"],
        ["Constants", "UPPER_SNAKE_CASE", "MAX_ITEMS = 10"],
        ["Event handlers", "handle + Event", "handleSubmit"],
      ]],
      ["h", "The standard page layout"],
      ["p", "Almost every website follows the same frontend layout: a **header** with navigation, the **main** content, and a **footer**. Use semantic HTML tags — they help accessibility and SEO."],
      ["tree", `
┌──────────────────────────────┐
│  <header>  Logo · Nav links  │
├──────────────────────────────┤
│                              │
│  <main>   Page content       │
│           (changes per page) │
│                              │
├──────────────────────────────┤
│  <footer>  Links · ©         │
└──────────────────────────────┘`],
      ["code", "jsx", `
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './MainLayout.css';

function MainLayout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__content">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;`, "src/layouts/MainLayout.jsx"],
      ["code", "css", `
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto; /* header, content, footer */
}

.layout__content {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
}`, "src/layouts/MainLayout.css"],
      ["h", "Custom hooks: reuse your logic"],
      ["p", "When two components need the same logic (not the same UI), move it into a **custom hook** — a function whose name starts with `use`."],
      ["code", "jsx", `
import { useState } from 'react';

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle];
}

// In any component:
// const [isOpen, toggleOpen] = useToggle();`, "src/hooks/useToggle.js"],
      ["h", "Best-practice checklist"],
      ["list", [
        "**One component per file**, named the same as the file.",
        "**Keep components small.** If one passes ~150 lines, split it.",
        "**Use semantic HTML:** `<header>`, `<nav>`, `<main>`, `<footer>`, and `<button>` for clickable things (not `<div>`).",
        "**Always add `alt` text** to images.",
        "**Keep state close** to where it's used; lift it only when needed.",
        "**Don't repeat yourself** — extract repeated JSX into components and repeated logic into hooks.",
        "**Use Prettier and ESLint** to keep formatting and code quality consistent.",
      ]],
    ],
    takeaways: [
      "Start flat; group by purpose (components, pages, layouts, hooks, services, utils) as you grow.",
      "PascalCase for components, `useSomething` for hooks, camelCase for utilities.",
      "Use a layout component with semantic `<header>`, `<main>` and `<footer>`.",
    ],
    playground: `
import { useState } from 'react';

// --- hooks/useToggle.js ---
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  return [on, () => setOn((v) => !v)];
}

// --- components/Navbar.jsx ---
function Navbar({ page, onNavigate }) {
  return (
    <header style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #ddd' }}>
      <strong>⚛️ MySite</strong>
      <nav style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        {['Home', 'About'].map((p) => (
          <button key={p} onClick={() => onNavigate(p)} disabled={page === p}>{p}</button>
        ))}
      </nav>
    </header>
  );
}

// --- components/Footer.jsx ---
function Footer() {
  return <footer style={{ borderTop: '1px solid #ddd', padding: '12px 0', color: '#777' }}>© 2026 MySite</footer>;
}

// --- layouts/MainLayout.jsx ---
function MainLayout({ page, onNavigate, children }) {
  return (
    <div style={{ minHeight: '90vh', display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
      <Navbar page={page} onNavigate={onNavigate} />
      <main style={{ padding: '16px 0' }}>{children}</main>
      <Footer />
    </div>
  );
}

// --- pages/Home.jsx & pages/About.jsx ---
function Home() {
  const [showMore, toggleMore] = useToggle();
  return (
    <>
      <h1>Welcome home</h1>
      <button onClick={toggleMore}>{showMore ? 'Show less' : 'Show more'}</button>
      {showMore && <p>Layouts keep the header and footer the same on every page.</p>}
    </>
  );
}

function About() {
  return <h1>About us</h1>;
}

// --- App.jsx ---
function App() {
  const [page, setPage] = useState('Home');
  return (
    <MainLayout page={page} onNavigate={setPage}>
      {page === 'Home' ? <Home /> : <About />}
    </MainLayout>
  );
}`,
    quiz: [
      { q: "Where should a reusable Button component go?", options: ["pages/", "components/", "services/", "utils/"], answer: 1, why: "Reusable UI pieces belong in `components/`. `pages/` is for full screens." },
      { q: "What should a custom hook's name start with?", options: ["hook", "use", "get", "with"], answer: 1, why: "All hooks start with `use` — e.g. `useToggle`, `useFetch`." },
      { q: "Which HTML tag should wrap the main content of a page?", options: ["<div id=\"main\">", "<main>", "<section>", "<body>"], answer: 1, why: "`<main>` is the semantic tag for a page's primary content and helps accessibility." },
    ],
  },

  /* ------------------------------------------------------------------ 16 */
  {
    id: "mini-project",
    module: "beyond",
    title: "Mini Project: Todo App",
    minutes: 15,
    summary: "Put everything together and build a complete todo app with components, props, state, events, lists and forms.",
    body: [
      ["h", "What you'll practice"],
      ["list", [
        "**Components & props** — splitting the UI into small pieces.",
        "**State** — storing the list of todos.",
        "**Events & forms** — adding, ticking and deleting todos.",
        "**Lists & keys** — rendering every todo.",
        "**Conditional rendering** — an empty state message.",
        "**Lifting state** — one parent owns the data.",
      ]],
      ["h", "Step 1: Plan the components"],
      ["tree", `
App              ← owns the todos state
├── TodoForm     ← input + "Add" button
├── TodoList     ← maps over the todos
│   └── TodoItem ← checkbox, text, delete button
└── TodoStats    ← "2 of 5 done"`],
      ["h", "Step 2: Decide the state shape"],
      ["code", "js", `
// An array of objects. Each todo has a unique id.
[
  { id: 'a1', text: 'Learn JSX', done: true },
  { id: 'b2', text: 'Learn state', done: false },
]`],
      ["h", "Step 3: Write the state updates in App"],
      ["code", "jsx", `
function App() {
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    setTodos([...todos, { id: crypto.randomUUID(), text, done: false }]);
  }

  function toggleTodo(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  // ...render the components and pass these functions down
}`],
      ["note", "These three patterns cover almost every list update you'll ever write: **add** with spread, **update** with `map`, **remove** with `filter`."],
      ["h", "Step 4: Build it"],
      ["p", "Open the playground to see the full working app. Read through the code — you'll recognize every concept from the previous lessons."],
      ["h", "Challenges to level up"],
      ["steps", [
        "Add filter buttons: **All / Active / Done**.",
        "Save todos to `localStorage` with `useEffect` so they survive a page refresh.",
        "Let users edit a todo by double-clicking its text.",
        "Add a \"Clear completed\" button.",
        "Split each component into its own file using the folder structure from Lesson 15.",
      ]],
      ["tip", "Finished? Deploy your app for free with GitHub Pages, Netlify or Vercel, and share it on LinkedIn. A live demo link makes your portfolio stand out."],
    ],
    takeaways: [
      "Plan components and state **before** writing code.",
      "Add with spread, update with `map`, remove with `filter`.",
      "Keep the data in the parent; pass values and handler functions down.",
    ],
    playground: `
import { useState } from 'react';

function TodoForm({ onAdd }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs doing?"
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      <span style={{ flex: 1, textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.5 : 1 }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)} aria-label="Delete">✕</button>
    </li>
  );
}

function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) return <p>🎉 Nothing to do. Add a task above!</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function TodoStats({ todos }) {
  const done = todos.filter((t) => t.done).length;
  return <p style={{ color: '#666' }}>{done} of {todos.length} done</p>;
}

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn JSX', done: true },
    { id: 2, text: 'Learn state', done: false },
    { id: 3, text: 'Build a todo app', done: false },
  ]);

  function addTodo(text) {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  }

  function toggleTodo(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h1>📝 My Todos</h1>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      <TodoStats todos={todos} />
    </div>
  );
}`,
    quiz: [
      { q: "In the todo app, where should the todos state live?", options: ["In each TodoItem", "In TodoForm", "In App, the common parent", "In TodoStats"], answer: 2, why: "Several components need the todos, so the state lives in their common parent: `App`." },
      { q: "Which array method is best for removing a todo from state?", options: ["splice()", "pop()", "filter()", "delete"], answer: 2, why: "`filter()` returns a new array without the removed item. `splice` and `pop` mutate the original." },
    ],
  },
];
