var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// To inittialize the project, enter 2 commands, first is npm run dev(to watch compile tsx into jsx), second is npx serve(to start the server up )
// ---Library---
const asyncRenderCache = [];
var asyncCurrentPointer = 0;
const render = (el, container) => {
    var _a;
    if (typeof el === "string" ||
        typeof el === "number" ||
        typeof el === "undefined") {
        container.appendChild(document.createTextNode(el === undefined ? "undefined" : el.toString()));
        return;
    }
    if (typeof el.tag === "function") {
        const props = Object.assign(Object.assign({}, el.props), { children: el.children });
        if ((_a = el.props) === null || _a === void 0 ? void 0 : _a.loading) {
            if (!asyncRenderCache[asyncCurrentPointer]) {
                const asyncTree = el.tag(props);
                const currentPointer = asyncCurrentPointer;
                asyncRenderCache[currentPointer] = asyncTree;
                asyncTree.then((resultTree) => {
                    asyncRenderCache[currentPointer] = resultTree;
                    reRender();
                });
                render(el.props.loading, container);
            }
            else if (asyncRenderCache[asyncCurrentPointer] instanceof Promise) {
                render(el.props.loading, container);
            }
            else if (!(asyncRenderCache[asyncCurrentPointer] instanceof Promise)) {
                render(asyncRenderCache[asyncCurrentPointer], container);
            }
            asyncCurrentPointer++;
        }
        else {
            const tree = el.tag(props);
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
    const rootNode = document.getElementById("myapp");
    rootNode.innerHTML = null;
    render(React.createElement(App, null), rootNode);
    myAppStateCursor = 0;
    asyncCurrentPointer = 0;
};
// ---Application---
const MyAsyncComponent = (props) => __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch("http://localhost:8080/", { mode: "cors" });
    const data = yield response.json();
    return (React.createElement("div", null,
        React.createElement("p", null,
            "Client Name: ",
            data.name),
        React.createElement("p", null,
            "Client Email: ",
            data.email)));
});
const Counter = () => {
    const [counter, setCounter] = useState(0);
    return (React.createElement("button", { onclick: () => {
            setCounter(counter + 1);
        } },
        "This is a button and it has its own state. counter is now: ",
        counter));
};
var number = 0;
const App = () => {
    const [name, setName] = useState("Tin Tran");
    var [count, setCount] = useState(0);
    return (React.createElement("div", { draggable: true },
        React.createElement("h2", null,
            "Hello, my name is ",
            name,
            ". I am the library author"),
        React.createElement("p", null, "I am a pargraph"),
        React.createElement("input", { type: "text", onchange: (e) => {
                setName(e.target.value);
            } }),
        React.createElement("p", null, "Below is an async component"),
        React.createElement(MyAsyncComponent, { loading: React.createElement("h1", null, "Loading client") }),
        React.createElement("h2", null,
            " Counter value: ",
            count),
        React.createElement("button", { onclick: () => setCount(count + 1) }, "+1"),
        React.createElement("button", { onclick: () => setCount(count - 1) }, "-1"),
        React.createElement("p", null, " below is another component, which is Counter"),
        React.createElement(Counter, null)));
};
render(React.createElement(App, null), document.getElementById("myapp"));
