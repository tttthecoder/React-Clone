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
  render(React.createElement(App, null), rootNode);
};
// ---Application---
const Counter = () => {
  const [counter, setCounter] = useState(0);
  return React.createElement(
    "button",
    {
      onclick: () => {
        setCounter(counter + 1);
      },
    },
    "counter is: ",
    counter
  );
};
var number = 0;
const App = () => {
  const [name, setName] = useState("Tin Tran");
  var [count, setCount] = useState(0);
  return React.createElement(
    "div",
    { draggable: true },
    React.createElement(
      "h2",
      null,
      "Hello, my name is ",
      name,
      ". I am the library author"
    ),
    React.createElement("p", null, "I am a pargraph"),
    React.createElement("input", {
      type: "text",
      onchange: (e) => setName(e.target.value),
    }),
    React.createElement("h2", null, " Counter value: ", count),
    React.createElement("button", { onclick: () => setCount(count + 1) }, "+1"),
    React.createElement("button", { onclick: () => setCount(count - 1) }, "-1"),
    React.createElement("p", null, " below is my counter"),
    React.createElement(Counter, null)
  );
};
render(React.createElement(App, null), document.getElementById("myapp"));
