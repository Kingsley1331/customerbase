const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

// Company type
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/customers`)
        .then(res => res.data);
      }
    }
  })
});

// Customer type
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields:() => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
          type: CompanyType,
          resolve(parentValue, args) {
            return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
              .then(res => res.data);
          }
        }
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/customers/' + args.id)
          .then(res => res.data)
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/customers/')
          .then(res => res.data)
      }
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/companies/' + args.id)
          .then(res => res.data)
      }
    },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/companies/')
          .then(res => res.data)
      }
    }
  }
});

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
    fields: {
      addCustomer: {
        type:CustomerType,
        args:{
          name: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          age: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve(parentValue, args){
            return axios.post('http://localhost:3000/customers', {
                name: args.name,
                email: args.email,
                age: args.age
            })
            .then(res => res.data);
        }
      },
      deleteCustomer: {
        type:CustomerType,
        args:{
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve(parentValue, args){
            return axios.delete('http://localhost:3000/customers/' + args.id)
            .then(res => res.data);
        }
      },
      editCustomer: {
        type:CustomerType,
        args:{
          id: { type: new GraphQLNonNull(GraphQLString) },
          name: { type: GraphQLString },
          email: { type: GraphQLString },
          age: { type: GraphQLInt }
        },
        resolve(parentValue, args) {
            return axios.patch('http://localhost:3000/customers/' + args.id, args)
            .then(res => res.data);
        }
      }
    }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});

/** READ **/

// {
//   customers{
//     id,
//     email,
//     age,
//     name
//   }
// }

// {
//   customer(id: "2"){
//     id,
//     email,
//     age,
//     name
//   }
// }

/*** retrieve company from customer ***/
// {
//   customer(id: "2") {
// 		 name
//     company {
//       id
//       name
//     }
//   }
// }

/*** retrieve customers from company ***/
// {
//   company(id: "1") {
// 		name
//     id
//     description
//     customers {
//       name
//     }
//   }
// }

/** CREATE **/

// mutation{
//   addCustomer(name:"Harry White", email: "harry@gmail.com", age:34){
//     id,
//     name,
//     email
//   }
// }

/** DELETE **/

// mutation{
// 	deleteCustomer(id: "4"){
//     id
//   }
// }

/** UPDATE **/

// mutation{
//   editCustomer(id:"2", name:"Ada Lovelace", email: "ada@gmail.com"){
//     id,
//     name,
//     email
//   }
// }
