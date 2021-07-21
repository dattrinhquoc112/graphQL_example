//Import các thư viện cần dùng
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Xây dựng một Schema, sử dụng ngôn ngữ Schema GraphQL
var schema = buildSchema(`
  type Query {
    hello: String
    user(id: Int!): Person
    users(gender: String): [Person]
  },
  type Person {
    id: Int
    name: String
    age: Int
    gender: String  
  },
`);

var users = [  // Dummy data
  {
    id: 1,
    name: 'Brian',
    age: '21',
    gender: 'M'
  },
  {
    id:2,
    name: 'Kim',
    age: '22',
    gender: 'M'
  },
  {
    id:3,
    name: 'Joseph',
    age: '23',
    gender: 'M'
  },
  {
    id:3,
    name: 'Faith',
    age: '23',
    gender: 'F'
  },
  {
    id:5,
    name: 'Joy',
    age: '25',
    gender: 'F'
  }
];

var getUser = function(args) { // return a single user based on id
  var userID = args.id;
  return users.filter(user => {
    return user.id == userID;
  })[0];
}

var retrieveUsers = function(args) { // Return a list of users. Takes an optional gender parameter
  if(args.gender) {
    var gender = args.gender;
    return users.filter(user => user.gender === gender);
  } else {
    return users;
  }
}

// Root cung cấp chức năng phân giải cho mỗi endpoint API
var root = {
  hello: () => {
    return 'Hello world!';
  },
  user: getUser,
  users: retrieveUsers
};

//Tạo server với express
var app = express();

//Khai báo API graphql
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, //sử dụng công cụ GraphiQL để đưa ra các query GraphQL theo cách thủ công
}));

// Khởi tạo server tại port 4000
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');