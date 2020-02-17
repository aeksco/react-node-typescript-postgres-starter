import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
    queryFields as directorQueryFields,
    mutationFields as directorMutationFields
} from "./director/director.graphql";

// // // //

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        ...directorQueryFields
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        ...directorMutationFields
    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
