// To inittialize the project, enter 2 commands, first is npm run dev(to watch compile tsx into jsx), second is npx serve(to start the server up )
// ---Library---
const asyncRenderCache = [];
var asyncCurrentPointer = 0;
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
  if (typeof el.tag === "function") {
    const props = { ...el.props, children: el.children };
    const tree = el.tag(props);
    if (tree instanceof Promise) {
      if (!asyncRenderCache[asyncCurrentPointer]) {
        render(el.props.loading, container);
        const currentPointer = asyncCurrentPointer;
        asyncRenderCache[currentPointer] = tree;
        tree.then((asyncTree) => {
          asyncRenderCache[currentPointer] = asyncTree;
          reRender();
        });
      } else if (asyncRenderCache[asyncCurrentPointer] instanceof Promise) {
        render(el.props.loading, container);
      } else if (!(asyncRenderCache[asyncCurrentPointer] instanceof Promise)) {
        render(asyncRenderCache[asyncCurrentPointer], container);
      }
      asyncCurrentPointer++;
    } else {
      render(tree, container);
    }
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
  asyncCurrentPointer = 0;
  // console.log("reRender-ing :)");
  const rootNode = document.getElementById("myapp");
  rootNode.innerHTML = "";
  render(<App />, rootNode);
};
// ---Application---
const MyAsyncComponent = async (props) => {
  const response = await fetch("http://localhost:8080/", { mode: "cors" });
  const data = await response.json();
  return (
    <div>
      <p>Client Name: {data.name}</p>
      <p>Client Email: {data.email}</p>
    </div>
  );
};
const Counter = () => {
  const [counter, setCounter] = useState(0);
  return (
    <button
      onclick={() => {
        setCounter(counter + 1);
      }}
    >
      This is a button and it has its own state. counter is now: {counter}
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
      <input
        type="text"
        onchange={(e) => {
          setName(e.target.value);
        }}
      />
      <p>Below is an async component</p>
      <MyAsyncComponent loading={<h1>Loading client</h1>}></MyAsyncComponent>
      <p>Async component ends</p>
      <h2> Counter value: {count}</h2>
      <button onclick={() => setCount(count + 1)}>+1</button>
      <button onclick={() => setCount(count - 1)}>-1</button>
      <p> below is another component, which is Counter</p>
      <Counter />
      <p>Below is another async component</p>
      <MyAsyncComponent
        loading={<h1>Loading another client hahaha</h1>}
      ></MyAsyncComponent>
    </div>
  );
};
render(<App />, document.getElementById("myapp"));
