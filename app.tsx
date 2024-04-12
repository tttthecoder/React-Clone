// To inittialize the project, enter 2 commands, first is npm run dev(to watch compile tsx into jsx), second is npx serve(to start the server up )
// ---Library---
const render = (el, container) => {
  if (
    typeof el === "string" ||
    typeof el === "number" ||
    typeof el === "undefined"
  ) {
    container.appendChild(
      document.createTextNode(el === undefined ? "undefined" : el.toString())
    );
    return;
  }
  let domEl = document.createElement(el.tag);
  let elProps = el.props ? Object.keys(el.props) : null;
  if (elProps && elProps.length > 0) {
    elProps.forEach((prop) => (domEl[prop] = el.props[prop]));
  }
  if (el.children && el.children.length > 0) {
    el.children.forEach((node) => {
      render(node, domEl);
    });
  }
  container.appendChild(domEl);
};
const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      return tag(props, ...children);
    }
    const el = {
      tag,
      props,
      children,
    };
    return el;
  },
};
const myAppState = [];
let myAppStateCursor = 0;
const useState = (initialState) => {
  const stateCursor = myAppStateCursor;
  myAppState[stateCursor] = myAppState[stateCursor] || initialState;
  myAppStateCursor++;
  const setState = (newState) => {
    myAppState[stateCursor] = newState;
    reRender();
  };
  return [myAppState[stateCursor], setState];
};
const reRender = () => {
  myAppStateCursor = 0;
  console.log("reRender-ing :)");
  const rootNode = document.getElementById("myapp");
  rootNode.innerHTML = "";
  render(<App />, rootNode);
};
// ---Application---
const Counter = () => {
  const [counter, setCounter] = useState(0);
  return (
    <button
      onclick={() => {
        setCounter(counter + 1);
      }}
    >
      counter is: {counter}
    </button>
  );
};
var number = 0;
const App = () => {
  const [name, setName] = useState("Tin Tran");
  var [count, setCount] = useState(0);
  return (
    <div draggable>
      <h2>Hello, my name is {name}. I am the library author</h2>
      <p>I am a pargraph</p>
      <input type="text" onchange={(e) => setName(e.target.value)} />
      <h2> Counter value: {count}</h2>

      <button onclick={() => setCount(count + 1)}>+1</button>
      <button onclick={() => setCount(count - 1)}>-1</button>
      <p> below is my counter</p>
      <Counter />
    </div>
  );
};
render(<App />, document.getElementById("myapp"));
