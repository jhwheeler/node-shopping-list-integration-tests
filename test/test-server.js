const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list recipes on GET', function() {
        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);
                const expectedKeys = ['name', 'ingredients', 'id'];
                res.body.forEach(function(item) {
                    item.should.be.an('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });

    it('should add recipe on POST', function() {
        const newItem = {name: 'beans and rice', ingredients: 'tomatoes, beans, peppers, green onion'};
        return chai.request(app)
            .post('/recipes')
            .send(newItem)
            .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.an('object');
                res.body.should.include.keys('id', 'name', 'ingredients');
                res.body.id.should.not.be.null;
                res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
            });
    });

    it('should update items on PUT', function() {
        const updateData = {
            name: 'foo',
            ingredients: 'none'
        };

        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/recipes/${updateData.id}`)
                    .send(updateData);
            })
            .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.deep.equal(updateData);
            });
    });

    it('should delete item on DELETE', function() {
        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                return chai.request(app)
                .delete(`/recipes/${res.body[0].id}`);
            })
            .then(function (res) {
                res.should.have.status(204);
            });
    });
});

describe('Shopping List', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list items on GET', function() {
    return chai.request(app)
      .get('/shopping-list')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['id', 'name', 'checked'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should add an item on POST', function() {
    const newItem = {name: 'coffee', checked: false};
    return chai.request(app)
      .post('/shopping-list')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'checked');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });

  it('should update items on PUT', function() {
    const updateData = {
      name: 'foo',
      checked: true
    };

    return chai.request(app)
      .get('/shopping-list')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/shopping-list/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updateData);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
      .get('/shopping-list')
      .then(function(res) {
        return chai.request(app)
          .delete(`/shopping-list/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});
