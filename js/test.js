'use strict'
var React = require('react');
var ReactDom = require('react-dom');

var names = ['Kitty', 'Alice', 'Kate'];
var arrs = [
    <h1>hi</h1>,
    <h2>how are you</h2>
];

/* 
 * 组件类，组件类的第一个字母必须大写
 * class属性：className
 * for属性：htmFor
 * 上面俩为js的保留字
 * this.props.children: 1.当前组件无子节点，undefined 2.一个子节点，数据类型为object 3.多个子节点，数据类型是array

 */
var HelloMessage = React.createClass({
    render: function () {
        return <h2 id={this.props.id} className={this.props.className}>This is a {this.props.name}.</h2>
    }
});

var MyTitle = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired
    },
    // 设置默认title
    getDefaultProps: function () {
        return {
            title: 'Hello world'
        }
    },
    render: function () {
        return <h1>{this.props.title}</h1>
    }
});
var data = 1;
ReactDom.render(
    <MyTitle />,
    document.getElementById('main-container')
)
var MyComponent = React.createClass({
    handleClick: function () {
        this.refs.myTextInput.focus();
    },
    render: function () {
        return (
            <div>
                <input type="text">
            </div>
        )
    }
});
// attention: return 的是()
var NoteList = React.createClass({
    render: function () {
        return (
            <ol>
                {
                    React.Children.map(this.props.children, function (child) {
                        return <li>{child}</li>
                    })
                }
            </ol>
        );
    }
});
/*ReactDom.render(
    <NoteList>
        <h1>Kitty</h1>
        <h1>Kate</h1>
    </NoteList>,
    document.getElementById('main-container')
)*/
/*ReactDom.render(
    <HelloMessage name='Kitty' className="tt" id="test" />,
    document.getElementById('main-container')
)*/

/*ReactDom.render(
    <h1>This is a test of react.</h1>,
    document.getElementById('main-container')
)*/
/*ReactDom.render(
    <div>
        {
            names.map(function (name) {
                return <h1>hello, {name}</h1>
            })
        }
    </div>,
    document.getElementById('main-container')
)
*/
/*ReactDom.render(
    <div>
       {arrs}
    </div>,
    document.getElementById('main-container')
)
*/