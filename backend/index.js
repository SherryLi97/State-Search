const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const schema = buildSchema(`
  type Query {
    states(searchString: String!): [String!]
  }
`);

const statesofUS = [
    'Alabama', 
    'Alaska', 
    'Arizona', 
    'Arkansas', 
    'California', 
    'Colorado', 
    'Connecticut', 
    'Delaware', 
    'Florida', 
    'Georgia', 
    'Hawaii', 
    'Idaho', 
    'Illinois', 
    'Indiana', 
    'Iowa', 
    'Kansas', 
    'Kentucky', 
    'Louisiana', 
    'Maine', 
    'Maryland', 
    'Massachusetts', 
    'Michigan', 
    'Minnesota', 
    'Mississippi', 
    'Missouri', 
    'Montana', 
    'Nebraska', 
    'Nevada', 
    'New Hampshire', 
    'New Jersey', 
    'New Mexico', 
    'New York', 
    'North Carolina', 
    'North Dakota', 
    'Ohio', 
    'Oklahoma', 
    'Oregon', 
    'Pennsylvania', 
    'Rhode Island', 
    'South Carolina', 
    'South Dakota', 
    'Tennessee', 
    'Texas', 
    'Utah', 
    'Vermont', 
    'Virginia', 
    'Washington', 
    'West Virginia', 
    'Wisconsin', 
    'Wyoming'
];

const root = {
    states: ({searchString}) => {
        return statesofUS.filter(state => state.toLowerCase().startsWith(searchString.toLowerCase()));
    }
};

app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);

app.listen(4000);