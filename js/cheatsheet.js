/* ==========================================================================
   Cheat sheet: one card per core idea, each linking back to its lesson
   ========================================================================== */
(function () {
  "use strict";

  const { inline, escapeHtml, codeBlock, highlight } = window.RK;

  const CARDS = [
    {
      title: "Create a component",
      text: "A capitalized function that returns JSX.",
      lesson: "components",
      code: `
function Greeting() {
  return <h1>Hello!</h1>;
}

export default Greeting;

// Use it:
<Greeting />`,
    },
    {
      title: "JSX rules",
      text: "One parent, close every tag, `className`, camelCase, `{ }` for JavaScript.",
      lesson: "jsx",
      code: `
<>
  <h1 className="title">{user.name}</h1>
  <img src={url} alt="Avatar" />
  <label htmlFor="email">Email</label>
  <p style={{ fontSize: 18 }}>{2 + 2}</p>
</>`,
    },
    {
      title: "Props",
      text: "Pass data from parent to child. Read-only.",
      lesson: "props",
      code: `
function Card({ title, price = 0, children }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>\${price}</p>
      {children}
    </div>
  );
}

<Card title="Mug" price={12}>Nice mug</Card>`,
    },
    {
      title: "State with useState",
      text: "Data that changes. Calling the setter re-renders.",
      lesson: "state",
      code: `
const [count, setCount] = useState(0);

setCount(count + 1);            // set a new value
setCount((prev) => prev + 1);   // based on previous
setItems([...items, newItem]);  // add to array
setUser({ ...user, age: 30 });  // update object`,
    },
    {
      title: "Events",
      text: "Pass the function — don't call it.",
      lesson: "events",
      code: `
<button onClick={handleClick}>Save</button>
<button onClick={() => remove(id)}>Delete</button>
<input onChange={(e) => setText(e.target.value)} />
<form onSubmit={(e) => { e.preventDefault(); }}>`,
    },
    {
      title: "Conditional rendering",
      text: "Show different UI based on data.",
      lesson: "conditional-rendering",
      code: `
{isLoggedIn ? <Dashboard /> : <Login />}
{items.length > 0 && <List items={items} />}

if (loading) return <Spinner />;
if (!user) return null;`,
    },
    {
      title: "Lists & keys",
      text: "Use `map()` and a unique, stable `key`.",
      lesson: "lists-and-keys",
      code: `
<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
</ul>`,
    },
    {
      title: "Controlled inputs",
      text: "`value` from state, `onChange` updates state.",
      lesson: "forms",
      code: `
const [email, setEmail] = useState('');

<input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
<input type="checkbox" checked={agree}
  onChange={(e) => setAgree(e.target.checked)} />`,
    },
    {
      title: "useEffect",
      text: "Side effects after render. The array controls when it runs.",
      lesson: "use-effect",
      code: `
useEffect(() => { /* every render */ });
useEffect(() => { /* once */ }, []);
useEffect(() => { /* when id changes */ }, [id]);

useEffect(() => {
  const t = setInterval(tick, 1000);
  return () => clearInterval(t); // cleanup
}, []);`,
    },
    {
      title: "Update arrays in state",
      text: "Add with spread, update with `map`, remove with `filter`.",
      lesson: "mini-project",
      code: `
// Add
setTodos([...todos, newTodo]);

// Update one
setTodos(todos.map((t) =>
  t.id === id ? { ...t, done: !t.done } : t
));

// Remove
setTodos(todos.filter((t) => t.id !== id));`,
    },
    {
      title: "Styling",
      text: "CSS files, CSS Modules or inline style objects.",
      lesson: "styling",
      code: `
import './App.css';
import styles from './Button.module.css';

<div className="card" />
<button className={styles.primary} />
<p style={{ color: 'red', marginTop: 8 }} />`,
    },
    {
      title: "Project structure",
      text: "Group files by purpose as your app grows.",
      lesson: "folder-structure",
      lang: "bash",
      code: `
src/
  assets/       # images, fonts
  components/   # reusable UI (Button, Card)
  pages/        # full screens (Home, About)
  layouts/      # header + footer frames
  hooks/        # custom hooks (useFetch)
  services/     # API calls
  utils/        # helper functions
  App.jsx
  main.jsx`,
    },
  ];

  const LESSONS = window.RK_LESSONS;
  const grid = document.getElementById("cheatGrid");

  grid.innerHTML = CARDS.map((c, i) => {
    const lesson = LESSONS.find((l) => l.id === c.lesson);
    const n = lesson ? LESSONS.indexOf(lesson) + 1 : null;
    return (
      '<article class="cheat-card">' +
      '<h2><span class="n">' + (i + 1) + "</span>" + escapeHtml(c.title) + "</h2>" +
      "<p>" + inline(c.text) + "</p>" +
      codeBlock(c.code, c.lang || "jsx", c.lang === "bash" ? "Folders" : "JSX") +
      (lesson ? '<a class="more" href="learn.html#' + lesson.id + '">Lesson ' + n + ": " + escapeHtml(lesson.title) + " →</a>" : "") +
      "</article>"
    );
  }).join("");

  highlight(grid);

  document.getElementById("printBtn").addEventListener("click", () => window.print());
})();
