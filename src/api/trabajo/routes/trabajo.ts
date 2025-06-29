'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/trabajos',
      handler: 'trabajo.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/trabajos/:id',
      handler: 'trabajo.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/trabajos',
      handler: 'trabajo.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/trabajos/:id',
      handler: 'trabajo.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/trabajos/:id',
      handler: 'trabajo.delete',
      config: {
        policies: [],
      },
    },
  ],
};