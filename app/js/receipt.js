import React from 'react';

function Item(name, cost) {
    var users = [];
    function addUser(user) {
        users.push(user);
    }
    this.users = users;
    this.name = name;
    this.cost = cost;
}

export var ReceiptForm = React.createClass({
    onSubmit(event) {
        event.preventDefault();
        var name = this.refs.name.value;
        var cost = this.refs.cost.value;
        this.refs.name.value = '';
        this.refs.cost.value = '';
        this.props.addItem(new Item(name, cost));
    },
    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <input ref="name" placeholder="Name of item" />
                <input ref="cost" placeholder="Cost of item" type="number"/>
                <button type="submit">Add item</button>
            </form>
        );
    }
});

export var ReceiptItem = React.createClass({
    render() {
        var item = this.props.item;
        return (
            <li>
                {item.name} - ${item.cost}
            </li>
        );
    }
});

export var ReceiptList = React.createClass({
    render() {
        var items = this.props.items;
        return (
            <ul>
                {items.map((item) => {
                    return (
                        <ReceiptItem item={item} />
                    )
                })}
                <ReceiptForm addItem={this.props.addItem}/>
            </ul>
        );
    }
});

export var Receipt = React.createClass({
    addItem(item) {
        var items = this.state.items;
        items.push(item);
        this.setState({
            items: items
        });
    },
    getInitialState() {
        return {
            items: []
        }
    },
    render() {
        var name = 'New Receipt';
        var items = this.state.items;
        return (
            <div>
                <h1>{name}</h1>
                <ReceiptList items={items} addItem={this.addItem}/>
            </div>
        );
    }
});


export default Receipt;
