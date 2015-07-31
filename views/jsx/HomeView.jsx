import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';

var Router = require('react-router')
  , RouteHandler = Router.RouteHandler
  , Link = Router.Link;

export default class HomeView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h1>Lorem!</h1>
          <p>
            Donec ullamcorper nulla non metus auctor fringilla. Cras justo odio, dapibus ac
            facilisis in, egestas eget quam. Etiam porta sem malesuada magna mollis euismod. Donec
            ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod
            semper. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed
            consectetur.
          </p>
          <p>
            Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor
            fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor. Donec sed odio dui. Donec id elit
            non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id
            elit.
          </p>
          <p>
            Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies
            vehicula ut id elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis
            vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean eu leo quam.
            Pellentesque ornare sem lacinia quam venenatis vestibulum. Duis mollis, est non commodo
            luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas
            faucibus mollis interdum. Maecenas sed diam eget risus varius blandit sit amet non
            magna. Nullam id dolor id nibh ultricies vehicula ut id elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Maecenas
            sed diam eget risus varius blandit sit amet non magna.
          </p>
        </div>
      </div>
    );
  }
}
