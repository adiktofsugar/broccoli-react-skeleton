import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Receipt from 'receipt';

$(function () {
    ReactDOM.render(
        <Receipt />,
        document.getElementById('content')
    );
});
