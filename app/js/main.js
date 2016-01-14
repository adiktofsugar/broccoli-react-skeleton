import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Test from 'test';

$(function () {
    ReactDOM.render(
        <Test />,
        document.getElementById('content')
    );
});
